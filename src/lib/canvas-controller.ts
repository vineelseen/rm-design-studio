import {
  Canvas,
  Circle,
  FabricImage,
  FabricObject,
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
import type { SelectedObjectMeta, SelectedObjectType } from "@/types/project";
import { T501_ASSETS } from "@/components/brochure/templates/t501-assets";

type SelectionListener = (meta: SelectedObjectMeta | null) => void;

type TaggedFabricObject = FabricObject & {
  rmType?: string;
  rmLocked?: boolean;
  rmFilename?: string;
};

const SERIALIZED_PROPERTIES = [
  "rmType",
  "rmLocked",
  "rmFilename",
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
  const rmType = (object as TaggedFabricObject).rmType;
  if (rmType) {
    return rmType as SelectedObjectType;
  }
  if (object instanceof IText) return "text";
  if (object instanceof Triangle) return "triangle";
  if (object instanceof Rect) return "rect";
  if (object instanceof Circle) return "circle";
  if (object instanceof Line) return "line";
  if (object instanceof FabricImage) return "image";
  if (object.type === "group") return "group";
  return "unknown";
}

function toMeta(object: FabricObject): SelectedObjectMeta {
  const bounds = object.getBoundingRect();
  const tagged = object as TaggedFabricObject;

  const meta: SelectedObjectMeta = {
    type: getObjectType(object),
    left: Math.round(object.left ?? 0),
    top: Math.round(object.top ?? 0),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height),
    angle: Math.round(object.angle ?? 0),
    opacity: object.opacity ?? 1,
    fill: typeof object.fill === "string" ? object.fill : undefined,
    stroke: typeof object.stroke === "string" ? object.stroke : undefined,
    strokeWidth: object.strokeWidth ?? undefined,
    filename: tagged.rmFilename,
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

  private addAndSelect(object: FabricObject) {
    this.canvas.add(object);
    this.canvas.setActiveObject(object);
    this.canvas.renderAll();
    this.emitSelection();
  }

  addText(text = "Text", options?: Partial<{ fontSize: number; fontFamily: string; fontWeight: string }>) {
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
    if (filename) {
      tagged.rmFilename = filename;
    }

    this.addAndSelect(image);
  }

  async addSvgFromString(svg: string, filename?: string) {
    const { objects, options } = await loadSVGFromString(svg);
    const filtered = objects.filter(Boolean) as FabricObject[];
    if (filtered.length === 0) return;

    const group = util.groupSVGElements(filtered, options);
    group.scaleToWidth(A4_CANVAS_WIDTH * 0.4);
    this.centerObject(group);
    const tagged = tagObject(group, "group");
    if (filename) tagged.rmFilename = filename;
    this.addAndSelect(group);
  }

  applyBrandColor(color: string) {
    const active = this.canvas.getActiveObject();
    if (!active || (active as TaggedFabricObject).rmLocked) return;

    if (active instanceof Line) {
      active.set("stroke", color);
    } else if (active instanceof IText) {
      active.set("fill", color);
    } else {
      active.set({ fill: color, stroke: color });
    }

    active.setCoords();
    this.canvas.renderAll();
    this.emitSelection();
  }

  applyBrandFont(fontFamily: string) {
    const active = this.canvas.getActiveObject();
    if (active instanceof IText) {
      active.set("fontFamily", fontFamily);
      active.setCoords();
      this.canvas.renderAll();
      this.emitSelection();
    }
  }

  deleteSelected() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as TaggedFabricObject).rmLocked) return;
    this.canvas.remove(active);
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.emitSelection();
  }

  bringForward() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as TaggedFabricObject).rmLocked) return;
    this.canvas.bringObjectForward(active);
    this.canvas.renderAll();
  }

  sendBackward() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as TaggedFabricObject).rmLocked) return;
    const lockedCount = this.canvas
      .getObjects()
      .filter((o) => (o as TaggedFabricObject).rmLocked).length;
    this.canvas.sendObjectBackwards(active);
    for (let i = 0; i < lockedCount; i++) {
      const bg = this.canvas.getObjects()[i];
      if ((bg as TaggedFabricObject).rmLocked) {
        this.canvas.sendObjectToBack(bg);
      }
    }
    this.canvas.renderAll();
  }

  async duplicateSelected() {
    const active = this.canvas.getActiveObject();
    if (!active || (active as TaggedFabricObject).rmLocked) return;
    const clone = await active.clone();
    clone.set({
      left: (active.left ?? 0) + 20,
      top: (active.top ?? 0) + 20,
    });
    const rmType = (active as TaggedFabricObject).rmType;
    if (rmType) (clone as TaggedFabricObject).rmType = rmType;
    this.addAndSelect(clone);
  }

  updateActiveObject(updates: Partial<SelectedObjectMeta>) {
    const active = this.canvas.getActiveObject();
    if (!active || (active as TaggedFabricObject).rmLocked) return;

    if (updates.left !== undefined) active.set("left", updates.left);
    if (updates.top !== undefined) active.set("top", updates.top);
    if (updates.angle !== undefined) active.set("angle", updates.angle);
    if (updates.opacity !== undefined) active.set("opacity", updates.opacity);
    if (updates.fill !== undefined) active.set("fill", updates.fill);
    if (updates.stroke !== undefined) active.set("stroke", updates.stroke);
    if (updates.strokeWidth !== undefined) active.set("strokeWidth", updates.strokeWidth);

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
      active.set({
        scaleX: (active.scaleX ?? 1) * (nextWidth / Math.max(bounds.width, 1)),
        scaleY: (active.scaleY ?? 1) * (nextHeight / Math.max(bounds.height, 1)),
      });
    }

    active.setCoords();
    this.canvas.renderAll();
    this.emitSelection();
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
    const existing = this.canvas
      .getObjects()
      .find((o) => (o as TaggedFabricObject).rmLocked);
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
