import type { FabricObject } from "fabric";

import { A4_CANVAS_HEIGHT, A4_CANVAS_WIDTH } from "@/lib/canvas-constants";
import { isEditableObject, isUserLocked } from "@/lib/canvas/object-meta";

export type AlignMode =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom";

export type AlignPageMode =
  | "page-center-h"
  | "page-center-v"
  | "page-left"
  | "page-right"
  | "page-top"
  | "page-bottom";

function getBounds(objects: FabricObject[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  objects.forEach((object) => {
    const rect = object.getBoundingRect();
    minX = Math.min(minX, rect.left);
    minY = Math.min(minY, rect.top);
    maxX = Math.max(maxX, rect.left + rect.width);
    maxY = Math.max(maxY, rect.top + rect.height);
  });

  return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
}

function moveObject(
  object: FabricObject,
  deltaX: number,
  deltaY: number,
) {
  if (isUserLocked(object)) return;
  object.set({
    left: (object.left ?? 0) + deltaX,
    top: (object.top ?? 0) + deltaY,
  });
  object.setCoords();
}

export function alignObjects(objects: FabricObject[], mode: AlignMode) {
  const editable = objects.filter(isEditableObject);
  if (editable.length < 2) return;

  const bounds = getBounds(editable);

  editable.forEach((object) => {
    const rect = object.getBoundingRect();
    let deltaX = 0;
    let deltaY = 0;

    switch (mode) {
      case "left":
        deltaX = bounds.left - rect.left;
        break;
      case "center":
        deltaX = bounds.left + bounds.width / 2 - (rect.left + rect.width / 2);
        break;
      case "right":
        deltaX = bounds.left + bounds.width - (rect.left + rect.width);
        break;
      case "top":
        deltaY = bounds.top - rect.top;
        break;
      case "middle":
        deltaY = bounds.top + bounds.height / 2 - (rect.top + rect.height / 2);
        break;
      case "bottom":
        deltaY = bounds.top + bounds.height - (rect.top + rect.height);
        break;
    }

    moveObject(object, deltaX, deltaY);
  });
}

export function alignObjectToPage(object: FabricObject, mode: AlignPageMode) {
  if (!isEditableObject(object) || isUserLocked(object)) return;

  const rect = object.getBoundingRect();

  switch (mode) {
    case "page-center-h":
      moveObject(object, A4_CANVAS_WIDTH / 2 - (rect.left + rect.width / 2), 0);
      break;
    case "page-center-v":
      moveObject(object, 0, A4_CANVAS_HEIGHT / 2 - (rect.top + rect.height / 2));
      break;
    case "page-left":
      moveObject(object, -rect.left, 0);
      break;
    case "page-right":
      moveObject(object, A4_CANVAS_WIDTH - (rect.left + rect.width), 0);
      break;
    case "page-top":
      moveObject(object, 0, -rect.top);
      break;
    case "page-bottom":
      moveObject(object, 0, A4_CANVAS_HEIGHT - (rect.top + rect.height));
      break;
  }
}

export function distributeObjects(
  objects: FabricObject[],
  direction: "horizontal" | "vertical",
) {
  const editable = objects.filter(isEditableObject);
  if (editable.length < 3) return;

  const sorted = [...editable].sort((a, b) => {
    const ra = a.getBoundingRect();
    const rb = b.getBoundingRect();
    return direction === "horizontal" ? ra.left - rb.left : ra.top - rb.top;
  });

  const first = sorted[0].getBoundingRect();
  const last = sorted[sorted.length - 1].getBoundingRect();
  const totalSpace =
    direction === "horizontal"
      ? last.left + last.width - first.left
      : last.top + last.height - first.top;

  const objectSizes = sorted.map((object) => {
    const rect = object.getBoundingRect();
    return direction === "horizontal" ? rect.width : rect.height;
  });

  const used = objectSizes.reduce((sum, size) => sum + size, 0);
  const gap = (totalSpace - used) / (sorted.length - 1);

  let cursor =
    direction === "horizontal" ? first.left : first.top;

  sorted.forEach((object, index) => {
    if (index === 0 || index === sorted.length - 1) {
      const rect = object.getBoundingRect();
      cursor += direction === "horizontal" ? rect.width + gap : rect.height + gap;
      return;
    }

    const rect = object.getBoundingRect();
    if (direction === "horizontal") {
      moveObject(object, cursor - rect.left, 0);
      cursor += rect.width + gap;
    } else {
      moveObject(object, 0, cursor - rect.top);
      cursor += rect.height + gap;
    }
  });
}
