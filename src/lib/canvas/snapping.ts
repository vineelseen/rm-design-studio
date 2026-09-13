import type { FabricObject } from "fabric";

import { A4_CANVAS_HEIGHT, A4_CANVAS_WIDTH } from "@/lib/canvas-constants";
import { isEditableObject, isSystemLocked } from "@/lib/canvas/object-meta";
import type { SnapGuide } from "@/types/project";

const SNAP_THRESHOLD = 6;

type SnapTarget = {
  x: number;
  y: number;
  orientation: "horizontal" | "vertical";
};

function getObjectSnapTargets(object: FabricObject): SnapTarget[] {
  const rect = object.getBoundingRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return [
    { x: rect.left, y: centerY, orientation: "vertical" },
    { x: rect.left + rect.width, y: centerY, orientation: "vertical" },
    { x: centerX, y: centerY, orientation: "vertical" },
    { x: centerX, y: rect.top, orientation: "horizontal" },
    { x: centerX, y: rect.top + rect.height, orientation: "horizontal" },
    { x: centerX, y: centerY, orientation: "horizontal" },
  ];
}

function getPageSnapTargets(): SnapTarget[] {
  return [
    { x: 0, y: A4_CANVAS_HEIGHT / 2, orientation: "vertical" },
    { x: A4_CANVAS_WIDTH, y: A4_CANVAS_HEIGHT / 2, orientation: "vertical" },
    { x: A4_CANVAS_WIDTH / 2, y: A4_CANVAS_HEIGHT / 2, orientation: "vertical" },
    { x: A4_CANVAS_WIDTH / 2, y: 0, orientation: "horizontal" },
    { x: A4_CANVAS_WIDTH / 2, y: A4_CANVAS_HEIGHT, orientation: "horizontal" },
    { x: A4_CANVAS_WIDTH / 2, y: A4_CANVAS_HEIGHT / 2, orientation: "horizontal" },
  ];
}

export function snapMovingObject(
  moving: FabricObject,
  allObjects: FabricObject[],
): SnapGuide[] {
  if (!isEditableObject(moving) || isSystemLocked(moving)) return [];

  const rect = moving.getBoundingRect();
  const movingTargets = [
    { value: rect.left, orientation: "vertical" as const, edge: "left" },
    { value: rect.left + rect.width, orientation: "vertical" as const, edge: "right" },
    { value: rect.left + rect.width / 2, orientation: "vertical" as const, edge: "centerX" },
    { value: rect.top, orientation: "horizontal" as const, edge: "top" },
    { value: rect.top + rect.height, orientation: "horizontal" as const, edge: "bottom" },
    { value: rect.top + rect.height / 2, orientation: "horizontal" as const, edge: "centerY" },
  ];

  const targets: SnapTarget[] = [...getPageSnapTargets()];
  allObjects.forEach((object) => {
    if (object === moving || !isEditableObject(object) || isSystemLocked(object)) return;
    targets.push(...getObjectSnapTargets(object));
  });

  const guides: SnapGuide[] = [];
  let deltaX = 0;
  let deltaY = 0;

  for (const movingTarget of movingTargets) {
    for (const target of targets) {
      if (movingTarget.orientation !== target.orientation) continue;

      const movingValue = movingTarget.value;
      const snapValue = movingTarget.orientation === "vertical" ? target.x : target.y;
      const diff = snapValue - movingValue;

      if (Math.abs(diff) <= SNAP_THRESHOLD) {
        if (movingTarget.orientation === "vertical" && deltaX === 0) {
          deltaX = diff;
          guides.push({ orientation: "vertical", position: snapValue });
        }
        if (movingTarget.orientation === "horizontal" && deltaY === 0) {
          deltaY = diff;
          guides.push({ orientation: "horizontal", position: snapValue });
        }
      }
    }
  }

  if (deltaX !== 0 || deltaY !== 0) {
    moving.set({
      left: (moving.left ?? 0) + deltaX,
      top: (moving.top ?? 0) + deltaY,
    });
    moving.setCoords();
  }

  return guides;
}
