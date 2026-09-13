import {
  Canvas,
  Circle,
  FabricImage,
  FabricObject,
  IText,
  Line,
  Rect,
  loadSVGFromString,
  util,
} from "fabric";

import {
  A4_CANVAS_HEIGHT,
  A4_CANVAS_WIDTH,
  RM_BRAND_BLUE,
} from "@/lib/canvas-constants";
import type { SelectedObjectMeta, SelectedObjectType } from "@/types/project";
import { T501_ASSETS } from "@/components/brochure/templates/t501-assets";

type SelectionListener = (meta: SelectedObjectMeta | null) => void;

type TaggedFabricObject = FabricObject & {
  rmType?: string;
  rmLocked?: boolean;
};

const SERIALIZED_PROPERTIES = [
  "rmType",
  "rmLocked",
  "selectable",
  "evented",
  "hasControls",
  "hasBorders",
] as const;

function tagObject(object: FabricObject, rmType: string): TaggedFabricObject {
  const tagged = object as TaggedFabricObject;
  tagged.rmType = rmType;
  return tagged;
}

function getObjectType(object: FabricObject): SelectedObjectType {
  const rmType = (object as FabricObject & { rmType?: string }).rmType;

  if (rmType) {
    return rmType as SelectedObjectType;
  }

  if (object instanceof IText) {
    return "text";
  }

  if (object instanceof Rect) {
    return "rect";
  }

  if (object instanceof Circle) {
    return "circle";
  }

  if (object instanceof Line) {
    return "line";
  }

  if (object instanceof FabricImage) {
    return "image";
  }

  if (object.type === "group") {
    return "group";
  }

  return "unknown";
}

function toMeta(object: FabricObject): SelectedObjectMeta {
  const bounds = object.getBoundingRect();

  const meta: SelectedObjectMeta = {
    type: getObjectType(object),
    left: Math.round(object.left ?? 0),
    top: Math.round(object.top ?? 0),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
    angle: Math.round(object.angle ?? 0),
    fill: typeof object.fill === "string" ? object.fill : undefined,
    stroke: typeof object.stroke === "string" ? object.stroke : undefined,
  };

  if (object instanceof IText) {
    meta.fontFamily = object.fontFamily;
    meta.fontSize = object.fontSize;
    meta.fontWeight = object.fontWeight;
    meta.textAlign = object.textAlign;
    meta.text = object.text;
  }

  return meta;
}

export class CanvasController {
  readonly canvas: Canvas;
  private selectionListener: SelectionListener | null = null;

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
    this.canvas.on("object:modified", () => this.emitSelection());
    this.canvas.on("text:changed", () => this.emitSelection());
  }

  destroy() {
    this.canvas.dispose();
  }

  onSelectionChange(listener: SelectionListener) {
    this.selectionListener = listener;
    this.emitSelection();
  }

  private emitSelection() {
    const active = this.canvas.getActiveObject();
    this.selectionListener?.(active ? toMeta(active) : null);
  }

  private centerObject(object: FabricObject) {
    object.set({
      left: A4_CANVAS_WIDTH / 2,
      top: A4_CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
    });
  }

  addText() {
    const text = new IText("Text", {
      left: 80,
      top: 120,
      fontFamily: "Inter, sans-serif",
      fontSize: 28,
      fill: "#171D28",
      fontWeight: "400",
    });

    tagObject(text, "text");
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
    this.emitSelection();
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
    });

    tagObject(rect, "rect");
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
    this.emitSelection();
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
    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
    this.emitSelection();
  }

  addLine() {
    const line = new Line([100, 300, 280, 300], {
      stroke: RM_BRAND_BLUE,
      strokeWidth: 3,
    });

    tagObject(line, "line");
    this.canvas.add(line);
    this.canvas.setActiveObject(line);
    this.canvas.renderAll();
    this.emitSelection();
  }

  async addImageFromDataUrl(dataUrl: string) {
    const image = await FabricImage.fromURL(dataUrl);
    const maxWidth = A4_CANVAS_WIDTH * 0.45;
    const scale = Math.min(1, maxWidth / (image.width ?? maxWidth));

    image.set({
      left: A4_CANVAS_WIDTH * 0.45,
      top: A4_CANVAS_HEIGHT * 0.45,
      scaleX: scale,
      scaleY: scale,
      originX: "center",
      originY: "center",
    });

    tagObject(image, "image");
    this.canvas.add(image);
    this.canvas.setActiveObject(image);
    this.canvas.renderAll();
    this.emitSelection();
  }

  async addSvgFromString(svg: string) {
    const { objects, options } = await loadSVGFromString(svg);
    const filtered = objects.filter(Boolean) as FabricObject[];

    if (filtered.length === 0) {
      return;
    }

    const group = util.groupSVGElements(filtered, options);
    group.scaleToWidth(180);
    this.centerObject(group);
    tagObject(group, "group");
    this.canvas.add(group);
    this.canvas.setActiveObject(group);
    this.canvas.renderAll();
    this.emitSelection();
  }

  async setLockedBackground(url: string) {
    const existing = this.canvas
      .getObjects()
      .find((object) => (object as FabricObject & { rmLocked?: boolean }).rmLocked);

    if (existing) {
      this.canvas.remove(existing);
    }

    const image = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    image.set({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
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

  deleteSelected() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as FabricObject & { rmLocked?: boolean }).rmLocked) {
      return;
    }

    this.canvas.remove(active);
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.emitSelection();
  }

  bringForward() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as FabricObject & { rmLocked?: boolean }).rmLocked) {
      return;
    }

    this.canvas.bringObjectForward(active);
    this.canvas.renderAll();
  }

  sendBackward() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as FabricObject & { rmLocked?: boolean }).rmLocked) {
      return;
    }

    const objects = this.canvas.getObjects();
    const lockedCount = objects.filter(
      (object) => (object as FabricObject & { rmLocked?: boolean }).rmLocked,
    ).length;

    this.canvas.sendObjectBackwards(active);

    for (let index = 0; index < lockedCount; index += 1) {
      const background = this.canvas.getObjects()[index];
      if ((background as FabricObject & { rmLocked?: boolean }).rmLocked) {
        this.canvas.sendObjectToBack(background);
      }
    }

    this.canvas.renderAll();
  }

  async duplicateSelected() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as FabricObject & { rmLocked?: boolean }).rmLocked) {
      return;
    }

    const clone = await active.clone();
    clone.set({
      left: (active.left ?? 0) + 20,
      top: (active.top ?? 0) + 20,
    });

    const rmType = (active as FabricObject & { rmType?: string }).rmType;
    if (rmType) {
      (clone as FabricObject & { rmType: string }).rmType = rmType;
    }

    this.canvas.add(clone);
    this.canvas.setActiveObject(clone);
    this.canvas.renderAll();
    this.emitSelection();
  }

  updateActiveObject(updates: Partial<SelectedObjectMeta>) {
    const active = this.canvas.getActiveObject();
    if (!active || (active as FabricObject & { rmLocked?: boolean }).rmLocked) {
      return;
    }

    if (updates.left !== undefined) active.set("left", updates.left);
    if (updates.top !== undefined) active.set("top", updates.top);
    if (updates.angle !== undefined) active.set("angle", updates.angle);
    if (updates.fill !== undefined) active.set("fill", updates.fill);
    if (updates.stroke !== undefined) active.set("stroke", updates.stroke);

    if (active instanceof IText) {
      if (updates.fontFamily !== undefined) active.set("fontFamily", updates.fontFamily);
      if (updates.fontSize !== undefined) active.set("fontSize", updates.fontSize);
      if (updates.fontWeight !== undefined) active.set("fontWeight", updates.fontWeight);
      if (updates.textAlign !== undefined) active.set("textAlign", updates.textAlign);
      if (updates.text !== undefined) active.set("text", updates.text);
    }

    if (updates.width !== undefined || updates.height !== undefined) {
      const bounds = active.getBoundingRect();
      const nextWidth = updates.width ?? bounds.width;
      const nextHeight = updates.height ?? bounds.height;
      const scaleX = nextWidth / Math.max(bounds.width, 1);
      const scaleY = nextHeight / Math.max(bounds.height, 1);
      active.set({
        scaleX: (active.scaleX ?? 1) * scaleX,
        scaleY: (active.scaleY ?? 1) * scaleY,
      });
    }

    active.setCoords();
    this.canvas.renderAll();
    this.emitSelection();
  }

  toJSON() {
    return JSON.stringify(this.canvas.toObject([...SERIALIZED_PROPERTIES]));
  }

  async loadFromJSON(json: string | null) {
    this.canvas.clear();
    this.canvas.backgroundColor = "#ffffff";

    if (!json) {
      this.canvas.renderAll();
      this.emitSelection();
      return;
    }

    await this.canvas.loadFromJSON(JSON.parse(json));
    this.canvas.renderAll();
    this.emitSelection();
  }

  async applyTemplateBackground() {
    await this.setLockedBackground(T501_ASSETS.coverBackground);
  }

  renderAll() {
    this.canvas.renderAll();
  }
}
