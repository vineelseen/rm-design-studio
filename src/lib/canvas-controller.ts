import {
  ActiveSelection,
  Canvas,
  Circle,
  FabricImage,
  FabricObject,
  Group,
  IText,
  Line,
  Rect,
  Triangle,
  loadSVGFromString,
  util,
} from "fabric";

import {
  A4_CANVAS_HEIGHT,
  A4_CANVAS_WIDTH,
  RM_BRAND_BLUE,
} from "@/lib/canvas-constants";
import {
  alignObjectToPage,
  alignObjects,
  distributeObjects,
  type AlignMode,
  type AlignPageMode,
} from "@/lib/canvas/alignment";
import { PageHistoryManager } from "@/lib/canvas/history";
import {
  SERIALIZED_PROPERTIES,
  TaggedFabricObject,
  defaultLayerName,
  ensureObjectId,
  isEditableObject,
  isSystemLocked,
  isUserLocked,
  readShadowMeta,
  tagObject,
  toMeta,
  writeShadowMeta,
} from "@/lib/canvas/object-meta";
import { clearSnapState, snapMovingObject } from "@/lib/canvas/snapping";
import { SHADOW_PRESETS } from "@/lib/canvas/shadow-utils";
import type {
  LayerItem,
  ObjectShadowMeta,
  SelectedObjectMeta,
  SnapGuide,
} from "@/types/project";
import { T501_ASSETS } from "@/components/brochure/templates/t501-assets";

type SelectionListener = (meta: SelectedObjectMeta | null) => void;
type LayersListener = (layers: LayerItem[]) => void;
type GuidesListener = (guides: SnapGuide[]) => void;
type HistoryListener = (state: { canUndo: boolean; canRedo: boolean }) => void;
type ShadowListener = (shadow: ObjectShadowMeta | null) => void;

export class CanvasController {
  readonly canvas: Canvas;
  private selectionListener: SelectionListener | null = null;
  private layersListener: LayersListener | null = null;
  private guidesListener: GuidesListener | null = null;
  private historyListener: HistoryListener | null = null;
  private shadowListener: ShadowListener | null = null;
  private clipboard: FabricObject[] | null = null;
  private readonly history = new PageHistoryManager();
  private activePageId: string | null = null;
  private isRestoringHistory = false;
  private displayScale = 1;
  private shadowGestureActive = false;

  constructor(element: HTMLCanvasElement) {
    this.canvas = new Canvas(element, {
      width: A4_CANVAS_WIDTH,
      height: A4_CANVAS_HEIGHT,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });

    this.canvas.on("selection:created", () => this.emitSelection());
    this.canvas.on("selection:updated", () => this.emitSelection());
    this.canvas.on("selection:cleared", () => this.emitSelection());
    this.canvas.on("text:editing:entered", () => {
      if (this.isRestoringHistory || !this.activePageId) return;
      this.history.beginGesture(this.toJSON());
    });

    this.canvas.on("text:editing:exited", () => {
      if (this.isRestoringHistory || !this.activePageId) return;
      this.history.commitGesture(this.activePageId, this.toJSON());
      this.emitHistory();
    });

    this.canvas.on("text:changed", () => this.emitSelection());
    this.canvas.on("object:added", () => this.emitLayers());
    this.canvas.on("object:removed", () => this.emitLayers());

    this.canvas.on("mouse:down", (event) => {
      const target = event.target;
      if (!target || !isEditableObject(target) || isUserLocked(target)) return;
      if (this.isRestoringHistory || !this.activePageId) return;
      this.history.beginGesture(this.toJSON());
    });

    this.canvas.on("object:moving", (event) => {
      const target = event.target;
      if (!target) return;
      const guides = snapMovingObject(
        target,
        this.canvas.getObjects(),
        this.displayScale,
      );
      this.guidesListener?.(guides);
    });

    this.canvas.on("mouse:up", (event) => {
      const target = event.target;
      if (target) clearSnapState(target);
      this.guidesListener?.([]);
    });

    this.canvas.on("object:modified", () => {
      if (!this.isRestoringHistory && this.activePageId) {
        this.history.commitGesture(this.activePageId, this.toJSON());
      }
      this.emitSelection();
      this.emitLayers();
      this.emitHistory();
    });
  }

  destroy() {
    this.canvas.dispose();
  }

  onSelectionChange(listener: SelectionListener) {
    this.selectionListener = listener;
    this.emitSelection();
  }

  onLayersChange(listener: LayersListener) {
    this.layersListener = listener;
    this.emitLayers();
  }

  onGuidesChange(listener: GuidesListener) {
    this.guidesListener = listener;
  }

  onHistoryChange(listener: HistoryListener) {
    this.historyListener = listener;
    this.emitHistory();
  }

  onShadowChange(listener: ShadowListener) {
    this.shadowListener = listener;
  }

  setDisplayScale(scale: number) {
    this.displayScale = scale > 0 ? scale : 1;
  }

  setActivePageId(pageId: string | null) {
    this.activePageId = pageId;
    this.history.setActivePage(pageId);
    this.emitHistory();
  }

  canUndo(): boolean {
    return this.history.canUndo(this.activePageId);
  }

  canRedo(): boolean {
    return this.history.canRedo(this.activePageId);
  }

  private emitHistory() {
    this.historyListener?.({
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    });
  }

  private recordHistoryBeforeChange() {
    if (this.isRestoringHistory || !this.activePageId) return;
    this.history.pushSnapshot(this.activePageId, this.toJSON());
  }

  async undo() {
    if (!this.activePageId || !this.canUndo()) return;
    const current = this.toJSON();
    const previous = this.history.undo(this.activePageId, current);
    if (!previous) return;
    await this.restoreSnapshot(previous);
  }

  async redo() {
    if (!this.activePageId || !this.canRedo()) return;
    const current = this.toJSON();
    const next = this.history.redo(this.activePageId, current);
    if (!next) return;
    await this.restoreSnapshot(next);
  }

  private async restoreSnapshot(json: string) {
    this.isRestoringHistory = true;
    try {
      await this.loadFromJSON(json, { skipHistory: true });
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
      this.emitSelection();
      this.emitLayers();
    } finally {
      this.isRestoringHistory = false;
      this.emitHistory();
    }
  }

  private emitSelection() {
    const active = this.canvas.getActiveObject();
    this.selectionListener?.(active ? toMeta(active) : null);
    this.emitLayers();
  }

  private emitLayers() {
    this.layersListener?.(this.getLayers());
  }

  private getEditableObjects(): FabricObject[] {
    return this.canvas.getObjects().filter(isEditableObject);
  }

  getLayers(): LayerItem[] {
    const objects = this.getEditableObjects();
    return objects
      .map((object, index) => {
        const tagged = object as TaggedFabricObject;
        return {
          id: ensureObjectId(object),
          name: tagged.rmName ?? defaultLayerName(object),
          type: (tagged.rmType as LayerItem["type"]) ?? "unknown",
          visible: object.visible !== false,
          locked: isUserLocked(object),
          index,
        };
      })
      .reverse();
  }

  private findObjectById(id: string): FabricObject | undefined {
    return this.getEditableObjects().find(
      (object) => ensureObjectId(object) === id,
    );
  }

  private preserveLockedBackgrounds() {
    this.canvas.getObjects().forEach((object) => {
      if (isSystemLocked(object)) {
        this.canvas.sendObjectToBack(object);
      }
    });
  }

  private addAndSelect(object: FabricObject) {
    this.recordHistoryBeforeChange();
    this.canvas.add(object);
    this.canvas.setActiveObject(object);
    this.preserveLockedBackgrounds();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  private getActiveObjects(): FabricObject[] {
    const active = this.canvas.getActiveObject();
    if (!active) return [];
    if (active instanceof ActiveSelection) {
      return active.getObjects().filter(isEditableObject);
    }
    return isEditableObject(active) ? [active] : [];
  }

  selectLayer(id: string) {
    const object = this.findObjectById(id);
    if (!object) return;
    this.canvas.setActiveObject(object);
    this.canvas.renderAll();
    this.emitSelection();
  }

  setLayerVisibility(id: string, visible: boolean) {
    const object = this.findObjectById(id);
    if (!object) return;
    this.recordHistoryBeforeChange();
    object.set("visible", visible);
    this.canvas.requestRenderAll();
    this.emitLayers();
    this.emitSelection();
    this.emitHistory();
  }

  setLayerLocked(id: string, locked: boolean) {
    const object = this.findObjectById(id);
    if (!object || isSystemLocked(object)) return;
    this.recordHistoryBeforeChange();
    this.applyLockState(object, locked);
    this.canvas.requestRenderAll();
    this.emitLayers();
    this.emitSelection();
    this.emitHistory();
  }

  renameLayer(id: string, name: string) {
    const object = this.findObjectById(id);
    if (!object) return;
    this.recordHistoryBeforeChange();
    (object as TaggedFabricObject).rmName = name.trim() || defaultLayerName(object);
    this.emitLayers();
    this.emitSelection();
    this.emitHistory();
  }

  moveLayer(id: string, direction: "forward" | "backward" | "front" | "back") {
    const object = this.findObjectById(id);
    if (!object || isSystemLocked(object)) return;
    this.recordHistoryBeforeChange();

    switch (direction) {
      case "forward":
        this.canvas.bringObjectForward(object);
        break;
      case "backward":
        this.canvas.sendObjectBackwards(object);
        break;
      case "front":
        this.canvas.bringObjectToFront(object);
        break;
      case "back":
        this.canvas.sendObjectToBack(object);
        break;
    }

    this.preserveLockedBackgrounds();
    this.canvas.requestRenderAll();
    this.emitLayers();
    this.emitHistory();
  }

  private applyLockState(object: FabricObject, locked: boolean) {
    const tagged = object as TaggedFabricObject;
    tagged.rmUserLocked = locked;
    object.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      lockRotation: locked,
      hasControls: !locked,
      selectable: true,
      evented: true,
    });
    object.setCoords();
  }

  addText(
    text = "Text",
    options?: Partial<{ fontSize: number; fontFamily: string; fontWeight: string }>,
  ) {
    const item = new IText(text, {
      left: A4_CANVAS_WIDTH / 2,
      top: A4_CANVAS_HEIGHT / 3,
      originX: "center",
      originY: "center",
      fontFamily: options?.fontFamily ?? "Inter, sans-serif",
      fontSize: options?.fontSize ?? 28,
      fill: "#171D28",
      fontWeight: options?.fontWeight ?? "400",
    });
    tagObject(item, "text");
    this.addAndSelect(item);
  }

  addHeading() {
    this.addText("Add a heading", {
      fontSize: 42,
      fontFamily: "Sora, sans-serif",
      fontWeight: "600",
    });
  }

  addSubheading() {
    this.addText("Add a subheading", {
      fontSize: 28,
      fontFamily: "Sora, sans-serif",
      fontWeight: "600",
    });
  }

  addBodyText() {
    this.addText("Add body text", {
      fontSize: 18,
      fontFamily: "Inter, sans-serif",
      fontWeight: "400",
    });
  }

  addRectangle() {
    const rect = new Rect({
      left: 120,
      top: 180,
      width: 180,
      height: 110,
      fill: RM_BRAND_BLUE,
      stroke: RM_BRAND_BLUE,
      strokeWidth: 1,
      rx: 0,
      ry: 0,
    });
    tagObject(rect, "rect");
    this.addAndSelect(rect);
  }

  addSquare() {
    const rect = new Rect({
      left: 140,
      top: 200,
      width: 120,
      height: 120,
      fill: RM_BRAND_BLUE,
      stroke: RM_BRAND_BLUE,
      strokeWidth: 1,
      rx: 0,
      ry: 0,
    });
    tagObject(rect, "rect");
    this.addAndSelect(rect);
  }

  addCircle() {
    const circle = new Circle({
      left: 180,
      top: 220,
      radius: 60,
      fill: RM_BRAND_BLUE,
      stroke: RM_BRAND_BLUE,
      strokeWidth: 1,
    });
    tagObject(circle, "circle");
    this.addAndSelect(circle);
  }

  addTriangle() {
    const triangle = new Triangle({
      left: 200,
      top: 200,
      width: 120,
      height: 120,
      fill: RM_BRAND_BLUE,
      stroke: RM_BRAND_BLUE,
      strokeWidth: 1,
    });
    tagObject(triangle, "triangle");
    this.addAndSelect(triangle);
  }

  addLine() {
    const line = new Line([100, 300, 280, 300], {
      stroke: RM_BRAND_BLUE,
      strokeWidth: 3,
    });
    tagObject(line, "line");
    this.addAndSelect(line);
  }

  async addImageFromDataUrl(dataUrl: string, filename?: string) {
    const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = dataUrl;
    });

    const image = new FabricImage(imageElement);
    const maxWidth = A4_CANVAS_WIDTH * 0.6;
    const maxHeight = A4_CANVAS_HEIGHT * 0.6;
    const scale = Math.min(
      maxWidth / (image.width || maxWidth),
      maxHeight / (image.height || maxHeight),
      1,
    );

    image.set({
      left: A4_CANVAS_WIDTH / 2,
      top: A4_CANVAS_HEIGHT / 2,
      scaleX: scale,
      scaleY: scale,
      originX: "center",
      originY: "center",
    });

    const tagged = tagObject(image, "image");
    if (filename) tagged.rmFilename = filename;

    this.addAndSelect(image);
  }

  async addSvgFromString(svg: string, filename?: string) {
    const { objects, options } = await loadSVGFromString(svg);
    const filtered = objects.filter(Boolean) as FabricObject[];
    if (filtered.length === 0) return;

    const group = util.groupSVGElements(filtered, options) as Group;
    group.scaleToWidth(A4_CANVAS_WIDTH * 0.4);
    group.set({
      left: A4_CANVAS_WIDTH / 2,
      top: A4_CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
    });
    const tagged = tagObject(group, "group");
    if (filename) tagged.rmFilename = filename;
    tagged.rmName = filename ?? "SVG";
    this.addAndSelect(group);
  }

  applyBrandColor(color: string) {
    this.recordHistoryBeforeChange();
    const objects = this.getActiveObjects();
    objects.forEach((active) => {
      if (isUserLocked(active)) return;
      if (active instanceof Line) active.set("stroke", color);
      else if (active instanceof IText) active.set("fill", color);
      else active.set({ fill: color, stroke: color });
      active.setCoords();
    });
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  applyBrandFont(fontFamily: string) {
    this.recordHistoryBeforeChange();
    this.getActiveObjects().forEach((active) => {
      if (active instanceof IText && !isUserLocked(active)) {
        active.set("fontFamily", fontFamily);
        active.setCoords();
      }
    });
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  async groupSelected() {
    const active = this.canvas.getActiveObject();
    if (!active || !(active instanceof ActiveSelection)) return;
    const objects = active.getObjects().filter(isEditableObject);
    if (objects.length < 2) return;

    this.recordHistoryBeforeChange();
    this.canvas.discardActiveObject();
    objects.forEach((object) => this.canvas.remove(object));

    const group = new Group(objects);
    const tagged = tagObject(group, "group");
    tagged.rmName = `Group ${objects.length}`;
    this.addAndSelect(group);
  }

  async ungroupSelected() {
    const active = this.canvas.getActiveObject();
    if (!active || active.type !== "group" || active instanceof ActiveSelection) return;
    this.recordHistoryBeforeChange();
    const group = active as Group;
    const items = group.removeAll();
    this.canvas.remove(group);
    items.forEach((item) => {
      this.canvas.add(item);
      item.setCoords();
    });

    if (items.length > 1) {
      const selection = new ActiveSelection(items, { canvas: this.canvas });
      this.canvas.setActiveObject(selection);
    } else if (items.length === 1) {
      this.canvas.setActiveObject(items[0]);
    }

    this.preserveLockedBackgrounds();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  toggleLockSelected() {
    const objects = this.getActiveObjects();
    if (objects.length === 0) return;
    this.recordHistoryBeforeChange();
    const shouldLock = !objects.every(isUserLocked);
    objects.forEach((object) => this.applyLockState(object, shouldLock));
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  lockSelected() {
    this.recordHistoryBeforeChange();
    this.getActiveObjects().forEach((object) => this.applyLockState(object, true));
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  unlockSelected() {
    this.recordHistoryBeforeChange();
    this.getActiveObjects().forEach((object) => this.applyLockState(object, false));
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  deleteSelected() {
    const objects = this.getActiveObjects();
    if (objects.length === 0) return;
    this.recordHistoryBeforeChange();
    objects.forEach((object) => this.canvas.remove(object));
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  bringForward() {
    this.moveLayerForSelection("forward");
  }

  sendBackward() {
    this.moveLayerForSelection("backward");
  }

  bringToFront() {
    this.moveLayerForSelection("front");
  }

  sendToBack() {
    this.moveLayerForSelection("back");
  }

  private moveLayerForSelection(
    direction: "forward" | "backward" | "front" | "back",
  ) {
    const objects = this.getActiveObjects();
    if (objects.length === 0) return;
    this.recordHistoryBeforeChange();

    const ordered =
      direction === "backward" || direction === "back"
        ? [...objects]
        : [...objects].reverse();

    ordered.forEach((object) => {
      if (isSystemLocked(object) || isUserLocked(object)) return;
      switch (direction) {
        case "forward":
          this.canvas.bringObjectForward(object);
          break;
        case "backward":
          this.canvas.sendObjectBackwards(object);
          break;
        case "front":
          this.canvas.bringObjectToFront(object);
          break;
        case "back":
          this.canvas.sendObjectToBack(object);
          break;
      }
    });

    this.preserveLockedBackgrounds();
    this.canvas.requestRenderAll();
    this.emitLayers();
    this.emitHistory();
  }

  async duplicateSelected() {
    const objects = this.getActiveObjects();
    if (objects.length === 0) return;
    this.recordHistoryBeforeChange();

    const clones = await Promise.all(
      objects.map(async (object) => {
        const clone = await object.clone();
        clone.set({
          left: (object.left ?? 0) + 20,
          top: (object.top ?? 0) + 20,
        });
        const source = object as TaggedFabricObject;
        const target = clone as TaggedFabricObject;
        target.rmType = source.rmType;
        target.rmFilename = source.rmFilename;
        target.rmName = source.rmName
          ? `${source.rmName} Copy`
          : defaultLayerName(clone);
        target.rmShadow = source.rmShadow
          ? { ...source.rmShadow }
          : undefined;
        ensureObjectId(clone);
        return clone;
      }),
    );

    clones.forEach((clone) => this.canvas.add(clone));
    if (clones.length > 1) {
      const selection = new ActiveSelection(clones, { canvas: this.canvas });
      this.canvas.setActiveObject(selection);
    } else {
      this.canvas.setActiveObject(clones[0]);
    }

    this.preserveLockedBackgrounds();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  async copySelected() {
    const objects = this.getActiveObjects();
    if (objects.length === 0) return;
    this.clipboard = await Promise.all(objects.map((object) => object.clone()));
  }

  async cutSelected() {
    await this.copySelected();
    this.deleteSelected();
  }

  async pasteClipboard() {
    if (!this.clipboard?.length) return;
    this.recordHistoryBeforeChange();

    const clones = await Promise.all(
      this.clipboard.map(async (object) => {
        const clone = await object.clone();
        clone.set({
          left: (object.left ?? 0) + 20,
          top: (object.top ?? 0) + 20,
        });
        ensureObjectId(clone);
        return clone;
      }),
    );

    clones.forEach((clone) => this.canvas.add(clone));
    if (clones.length > 1) {
      const selection = new ActiveSelection(clones, { canvas: this.canvas });
      this.canvas.setActiveObject(selection);
    } else {
      this.canvas.setActiveObject(clones[0]);
    }

    this.preserveLockedBackgrounds();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  alignSelection(mode: AlignMode) {
    this.recordHistoryBeforeChange();
    alignObjects(this.getActiveObjects(), mode);
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  alignSelectionToPage(mode: AlignPageMode) {
    this.recordHistoryBeforeChange();
    this.getActiveObjects().forEach((object) => alignObjectToPage(object, mode));
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  distributeSelection(direction: "horizontal" | "vertical") {
    this.recordHistoryBeforeChange();
    distributeObjects(this.getActiveObjects(), direction);
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.emitHistory();
  }

  canGroup(): boolean {
    const active = this.canvas.getActiveObject();
    return Boolean(
      active && active instanceof ActiveSelection && active.getObjects().length > 1,
    );
  }

  canUngroup(): boolean {
    const active = this.canvas.getActiveObject();
    return Boolean(
      active && active.type === "group" && !(active instanceof ActiveSelection),
    );
  }

  canDistribute(): boolean {
    return this.getActiveObjects().length >= 3;
  }

  isSelectionLocked(): boolean {
    const objects = this.getActiveObjects();
    return objects.length > 0 && objects.every(isUserLocked);
  }

  updateActiveObject(
    updates: Partial<SelectedObjectMeta>,
    options?: { skipHistory?: boolean },
  ) {
    const active = this.canvas.getActiveObject();
    if (!active || isSystemLocked(active)) return;

    if (!options?.skipHistory && !updates.shadow) {
      this.recordHistoryBeforeChange();
    }

    const targets = active instanceof ActiveSelection
      ? active.getObjects().filter((object) => !isUserLocked(object))
      : isUserLocked(active)
        ? []
        : [active];

    targets.forEach((object) => {
      if (updates.left !== undefined) object.set("left", updates.left);
      if (updates.top !== undefined) object.set("top", updates.top);
      if (updates.angle !== undefined) object.set("angle", updates.angle);
      if (updates.opacity !== undefined) object.set("opacity", updates.opacity);
      if (updates.fill !== undefined) object.set("fill", updates.fill);
      if (updates.stroke !== undefined) object.set("stroke", updates.stroke);
      if (updates.strokeWidth !== undefined) object.set("strokeWidth", updates.strokeWidth);
      if (updates.name !== undefined) {
        (object as TaggedFabricObject).rmName = updates.name;
      }

      if (object instanceof Rect && updates.cornerRadius !== undefined) {
        object.set({ rx: updates.cornerRadius, ry: updates.cornerRadius });
      }

      if (object instanceof IText) {
        if (updates.fontFamily !== undefined) object.set("fontFamily", updates.fontFamily);
        if (updates.fontSize !== undefined) object.set("fontSize", updates.fontSize);
        if (updates.fontWeight !== undefined) object.set("fontWeight", updates.fontWeight);
        if (updates.textAlign !== undefined) object.set("textAlign", updates.textAlign);
        if (updates.text !== undefined) {
          object.set("text", updates.text);
          (object as TaggedFabricObject).rmName = defaultLayerName(object);
        }
      }

      if (updates.shadow) {
        writeShadowMeta(object, updates.shadow);
      }

      if (updates.width !== undefined || updates.height !== undefined) {
        const bounds = object.getBoundingRect();
        const nextWidth = updates.width ?? bounds.width;
        const nextHeight = updates.height ?? bounds.height;
        object.set({
          scaleX: (object.scaleX ?? 1) * (nextWidth / Math.max(bounds.width, 1)),
          scaleY: (object.scaleY ?? 1) * (nextHeight / Math.max(bounds.height, 1)),
        });
      }

      object.setCoords();
    });

    this.canvas.requestRenderAll();
    this.emitSelection();
    if (!options?.skipHistory) {
      this.emitHistory();
    }
  }

  beginShadowGesture() {
    if (this.shadowGestureActive) return;
    this.shadowGestureActive = true;
    this.history.beginGesture(this.toJSON());
  }

  applyShadowLive(meta: ObjectShadowMeta) {
    const active = this.canvas.getActiveObject();
    if (!active || isSystemLocked(active)) return;

    const targets = active instanceof ActiveSelection
      ? active.getObjects().filter((object) => !isUserLocked(object))
      : isUserLocked(active)
        ? []
        : [active];

    targets.forEach((object) => {
      writeShadowMeta(object, meta);
      object.setCoords();
    });

    this.canvas.requestRenderAll();
    this.shadowListener?.(meta);
  }

  commitShadowGesture() {
    if (!this.shadowGestureActive) return;
    this.shadowGestureActive = false;
    if (this.activePageId) {
      this.history.commitGesture(this.activePageId, this.toJSON());
    }
    this.emitSelection();
    this.emitHistory();
  }

  applyShadowCommit(meta: ObjectShadowMeta) {
    this.recordHistoryBeforeChange();
    this.applyShadowLive(meta);
    this.emitSelection();
    this.emitHistory();
  }

  applyShadowPreset(preset: keyof typeof SHADOW_PRESETS) {
    const meta = SHADOW_PRESETS[preset];
    this.recordHistoryBeforeChange();
    this.applyShadowLive(meta);
    this.emitSelection();
    this.emitHistory();
  }

  toJSON() {
    return JSON.stringify(this.canvas.toObject([...SERIALIZED_PROPERTIES]));
  }

  exportThumbnail() {
    return this.canvas.toDataURL({
      format: "png",
      multiplier: 0.2,
      enableRetinaScaling: true,
    });
  }

  exportHighResDataUrl(multiplier = 2.5) {
    return this.canvas.toDataURL({
      format: "png",
      multiplier,
      enableRetinaScaling: true,
    });
  }

  async loadFromJSON(
    json: string | null,
    options?: { skipHistory?: boolean },
  ) {
    const wasRestoring = this.isRestoringHistory;
    if (options?.skipHistory) {
      this.isRestoringHistory = true;
    }

    this.canvas.clear();
    this.canvas.backgroundColor = "#ffffff";
    if (!json) {
      this.canvas.requestRenderAll();
      this.emitSelection();
      if (options?.skipHistory) {
        this.isRestoringHistory = wasRestoring;
      }
      return;
    }
    await this.canvas.loadFromJSON(JSON.parse(json));
    this.canvas.getObjects().forEach((object) => {
      ensureObjectId(object);
      if (isUserLocked(object)) {
        this.applyLockState(object, true);
      }
      const tagged = object as TaggedFabricObject;
      if (tagged.rmShadow) {
        writeShadowMeta(object, tagged.rmShadow);
      } else if (object.shadow) {
        tagged.rmShadow = readShadowMeta(object);
      }
    });
    this.canvas.requestRenderAll();
    this.emitSelection();
    if (options?.skipHistory) {
      this.isRestoringHistory = wasRestoring;
    }
  }

  async applyTemplateBackground() {
    const existing = this.canvas
      .getObjects()
      .find((object) => isSystemLocked(object));
    if (existing) this.canvas.remove(existing);

    const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load background"));
      img.src = T501_ASSETS.coverBackground;
    });

    const image = new FabricImage(imgEl);
    image.set({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
    });

    const scale = Math.max(
      A4_CANVAS_WIDTH / (image.width ?? A4_CANVAS_WIDTH),
      A4_CANVAS_HEIGHT / (image.height ?? A4_CANVAS_HEIGHT),
    );
    image.scale(scale);
    const tagged = tagObject(image, "image");
    tagged.rmLocked = true;
    this.canvas.add(image);
    this.canvas.sendObjectToBack(image);
    this.canvas.renderAll();
  }

  renderAll() {
    this.canvas.renderAll();
  }
}
