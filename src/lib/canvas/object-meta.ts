import {
  ActiveSelection,
  Circle,
  FabricImage,
  FabricObject,
  IText,
  Line,
  Rect,
  Triangle,
} from "fabric";

import {
  metaFromFabricShadow,
  shadowMetaToFabric,
} from "@/lib/canvas/shadow-utils";
import type { ObjectShadowMeta, SelectedObjectMeta, SelectedObjectType } from "@/types/project";

export type TaggedFabricObject = FabricObject & {
  rmId?: string;
  rmType?: string;
  rmLocked?: boolean;
  rmUserLocked?: boolean;
  rmFilename?: string;
  rmName?: string;
  rmShadow?: ObjectShadowMeta;
};

export const SERIALIZED_PROPERTIES = [
  "rmId",
  "rmType",
  "rmLocked",
  "rmUserLocked",
  "rmFilename",
  "rmName",
  "rmShadow",
  "selectable",
  "evented",
  "hasControls",
  "hasBorders",
  "visible",
  "lockMovementX",
  "lockMovementY",
  "lockScalingX",
  "lockScalingY",
  "lockRotation",
] as const;

export function ensureObjectId(object: FabricObject): string {
  const tagged = object as TaggedFabricObject;
  if (!tagged.rmId) {
    tagged.rmId = `obj-${crypto.randomUUID()}`;
  }
  return tagged.rmId;
}

export function tagObject(object: FabricObject, rmType: string): TaggedFabricObject {
  const tagged = object as TaggedFabricObject;
  tagged.rmType = rmType;
  ensureObjectId(tagged);
  if (!tagged.rmName) {
    tagged.rmName = defaultLayerName(tagged);
  }
  return tagged;
}

export function isSystemLocked(object: FabricObject): boolean {
  return Boolean((object as TaggedFabricObject).rmLocked);
}

export function isUserLocked(object: FabricObject): boolean {
  return Boolean((object as TaggedFabricObject).rmUserLocked);
}

export function isEditableObject(object: FabricObject): boolean {
  return !isSystemLocked(object);
}

export function getObjectType(object: FabricObject): SelectedObjectType {
  const rmType = (object as TaggedFabricObject).rmType;
  if (rmType) return rmType as SelectedObjectType;
  if (object instanceof IText) return "text";
  if (object instanceof Triangle) return "triangle";
  if (object instanceof Rect) return "rect";
  if (object instanceof Circle) return "circle";
  if (object instanceof Line) return "line";
  if (object instanceof FabricImage) return "image";
  if (object.type === "group") return "group";
  return "unknown";
}

export function defaultLayerName(object: FabricObject): string {
  const type = getObjectType(object);
  const tagged = object as TaggedFabricObject;

  if (type === "text" && object instanceof IText) {
    const text = object.text?.trim() ?? "";
    if (text) {
      const short = text.length > 24 ? `${text.slice(0, 24)}...` : text;
      return short;
    }
    return "Text";
  }

  if (type === "image" && tagged.rmFilename) {
    return tagged.rmFilename;
  }

  if (type === "group") {
    return tagged.rmName ?? "Group";
  }

  const labels: Record<string, string> = {
    rect: "Rectangle",
    circle: "Circle",
    triangle: "Triangle",
    line: "Line",
    image: "Image",
    text: "Text",
  };

  return labels[type] ?? "Object";
}

export function readShadowMeta(object: FabricObject): ObjectShadowMeta {
  const tagged = object as TaggedFabricObject;
  if (tagged.rmShadow) {
    return tagged.rmShadow;
  }
  return metaFromFabricShadow(object.shadow);
}

export function writeShadowMeta(
  object: FabricObject,
  meta: ObjectShadowMeta,
): void {
  const tagged = object as TaggedFabricObject;
  tagged.rmShadow = meta;
  object.set("shadow", shadowMetaToFabric(meta));
}

export function toMeta(object: FabricObject): SelectedObjectMeta {
  if (object instanceof ActiveSelection) {
    const count = object.getObjects().filter(isEditableObject).length;
    const bounds = object.getBoundingRect();
    return {
      isMultiSelect: true,
      selectionCount: count,
      type: "unknown",
      left: Math.round(bounds.left),
      top: Math.round(bounds.top),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
      angle: Math.round(object.angle ?? 0),
      opacity: object.opacity ?? 1,
    };
  }

  const bounds = object.getBoundingRect();
  const tagged = object as TaggedFabricObject;

  const meta: SelectedObjectMeta = {
    id: ensureObjectId(object),
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
    name: tagged.rmName ?? defaultLayerName(object),
    locked: isUserLocked(object),
    visible: object.visible !== false,
    shadow: readShadowMeta(object),
  };

  if (object instanceof Rect) {
    meta.cornerRadius = Math.round(object.rx ?? object.ry ?? 0);
  }

  if (object instanceof IText) {
    meta.fontFamily = object.fontFamily;
    meta.fontSize = object.fontSize;
    meta.fontWeight = object.fontWeight;
    meta.textAlign = object.textAlign;
    meta.text = object.text;
  }

  if (object.type === "group") {
    meta.groupObjectCount = (object as { _objects?: FabricObject[] })._objects?.length;
  }

  return meta;
}
