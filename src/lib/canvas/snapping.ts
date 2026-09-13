import { Point, type FabricObject } from "fabric";

import { A4_CANVAS_HEIGHT, A4_CANVAS_WIDTH } from "@/lib/canvas-constants";
import {
  ensureObjectId,
  isEditableObject,
  isSystemLocked,
} from "@/lib/canvas/object-meta";
import type { SnapGuide } from "@/types/project";

const SCREEN_SNAP_THRESHOLD = 6;
const RELEASE_MULTIPLIER = 1.75;

type Axis = "x" | "y";

type SnapCandidate = {
  axis: Axis;
  delta: number;
  guide: SnapGuide;
};

type SnapState = {
  target: number;
};

const snapState = new Map<string, SnapState>();

function objectKey(object: FabricObject): string {
  return ensureObjectId(object);
}

function getThreshold(displayScale: number): number {
  const zoom = displayScale > 0 ? displayScale : 1;
  return SCREEN_SNAP_THRESHOLD / zoom;
}

function getReleaseThreshold(displayScale: number): number {
  return getThreshold(displayScale) * RELEASE_MULTIPLIER;
}

function getBounds(object: FabricObject) {
  const rect = object.getBoundingRect();
  return {
    left: rect.left,
    top: rect.top,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

function getPageTargets(): { x: number[]; y: number[] } {
  return {
    x: [0, A4_CANVAS_WIDTH / 2, A4_CANVAS_WIDTH],
    y: [0, A4_CANVAS_HEIGHT / 2, A4_CANVAS_HEIGHT],
  };
}

function getObjectTargets(object: FabricObject): { x: number[]; y: number[] } {
  const bounds = getBounds(object);
  return {
    x: [bounds.left, bounds.centerX, bounds.right],
    y: [bounds.top, bounds.centerY, bounds.bottom],
  };
}

function findBestCandidate(
  axis: Axis,
  movingEdges: number[],
  targets: number[],
  threshold: number,
  releaseThreshold: number,
  stateKey: string,
  orientation: SnapGuide["orientation"],
): SnapCandidate | null {
  const state = snapState.get(stateKey);

  if (state) {
    for (const edge of movingEdges) {
      const diff = state.target - edge;
      if (Math.abs(diff) <= releaseThreshold) {
        return {
          axis,
          delta: diff,
          guide: { orientation, position: state.target },
        };
      }
    }
  }

  let best: SnapCandidate | null = null;

  for (const edge of movingEdges) {
    for (const target of targets) {
      const diff = target - edge;
      const absDiff = Math.abs(diff);
      if (absDiff <= threshold) {
        if (!best || absDiff < Math.abs(best.delta)) {
          best = {
            axis,
            delta: diff,
            guide: { orientation, position: target },
          };
        }
      }
    }
  }

  return best;
}

function translateObject(object: FabricObject, deltaX: number, deltaY: number) {
  if (deltaX === 0 && deltaY === 0) return;

  const center = object.getCenterPoint();
  object.setPositionByOrigin(
    new Point(center.x + deltaX, center.y + deltaY),
    "center",
    "center",
  );
  object.setCoords();
}

export function clearSnapState(object?: FabricObject) {
  if (!object) {
    snapState.clear();
    return;
  }
  const key = objectKey(object);
  snapState.delete(`${key}-x`);
  snapState.delete(`${key}-y`);
}

export function snapMovingObject(
  moving: FabricObject,
  allObjects: FabricObject[],
  displayScale: number,
): SnapGuide[] {
  if (!isEditableObject(moving) || isSystemLocked(moving)) return [];

  const threshold = getThreshold(displayScale);
  const releaseThreshold = getReleaseThreshold(displayScale);
  const key = objectKey(moving);
  const bounds = getBounds(moving);

  const xEdges = [bounds.left, bounds.centerX, bounds.right];
  const yEdges = [bounds.top, bounds.centerY, bounds.bottom];

  const xTargets: number[] = [...getPageTargets().x];
  const yTargets: number[] = [...getPageTargets().y];

  allObjects.forEach((object) => {
    if (object === moving || object.visible === false || isSystemLocked(object)) {
      return;
    }
    const targets = getObjectTargets(object);
    xTargets.push(...targets.x);
    yTargets.push(...targets.y);
  });

  const bestX = findBestCandidate(
    "x",
    xEdges,
    xTargets,
    threshold,
    releaseThreshold,
    `${key}-x`,
    "vertical",
  );

  const bestY = findBestCandidate(
    "y",
    yEdges,
    yTargets,
    threshold,
    releaseThreshold,
    `${key}-y`,
    "horizontal",
  );

  const deltaX = bestX?.delta ?? 0;
  const deltaY = bestY?.delta ?? 0;
  const guides: SnapGuide[] = [];

  if (bestX) {
    snapState.set(`${key}-x`, { target: bestX.guide.position });
    guides.push(bestX.guide);
  } else {
    snapState.delete(`${key}-x`);
  }

  if (bestY) {
    snapState.set(`${key}-y`, { target: bestY.guide.position });
    guides.push(bestY.guide);
  } else {
    snapState.delete(`${key}-y`);
  }

  if (deltaX !== 0 || deltaY !== 0) {
    translateObject(moving, deltaX, deltaY);
  }

  return guides;
}
