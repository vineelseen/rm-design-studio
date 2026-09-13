import { Shadow } from "fabric";

import type { ObjectShadowMeta, ShadowPreset } from "@/types/project";

export const SHADOW_PRESETS: Record<
  Exclude<ShadowPreset, "custom">,
  ObjectShadowMeta
> = {
  none: {
    enabled: false,
    color: "#000000",
    opacity: 0,
    blur: 0,
    distance: 0,
    angle: 90,
    preset: "none",
  },
  subtle: {
    enabled: true,
    color: "#000000",
    opacity: 0.1,
    blur: 8,
    distance: 3,
    angle: 90,
    preset: "subtle",
  },
  medium: {
    enabled: true,
    color: "#000000",
    opacity: 0.18,
    blur: 14,
    distance: 6,
    angle: 90,
    preset: "medium",
  },
  strong: {
    enabled: true,
    color: "#000000",
    opacity: 0.25,
    blur: 24,
    distance: 10,
    angle: 90,
    preset: "strong",
  },
};

export function offsetsFromDistanceAngle(
  distance: number,
  angleDeg: number,
): { offsetX: number; offsetY: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    offsetX: Math.cos(rad) * distance,
    offsetY: Math.sin(rad) * distance,
  };
}

export function distanceAngleFromOffsets(
  offsetX: number,
  offsetY: number,
): { distance: number; angle: number } {
  const distance = Math.hypot(offsetX, offsetY);
  if (distance === 0) {
    return { distance: 0, angle: 90 };
  }
  const rad = Math.atan2(offsetY, offsetX);
  let angle = (rad * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return { distance, angle };
}

export function hexToRgba(hex: string, opacity: number): string {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function shadowMetaToFabric(meta: ObjectShadowMeta): Shadow | null {
  if (!meta.enabled) return null;

  const { offsetX, offsetY } = offsetsFromDistanceAngle(meta.distance, meta.angle);
  const rgba = hexToRgba(meta.color, meta.opacity);
  return new Shadow({
    color: rgba,
    blur: meta.blur,
    offsetX,
    offsetY,
  });
}

export function metaFromFabricShadow(
  shadow: Shadow | null | undefined,
): ObjectShadowMeta {
  if (!shadow) {
    return { ...SHADOW_PRESETS.none };
  }

  const color = typeof shadow.color === "string" ? shadow.color : "#000000";
  const opacity =
    color.startsWith("rgba")
      ? Number(color.split(",")[3]?.replace(")", "").trim() ?? 0.18)
      : 0.18;

  const offsetX = shadow.offsetX ?? 0;
  const offsetY = shadow.offsetY ?? 0;
  const { distance, angle } = distanceAngleFromOffsets(offsetX, offsetY);

  return {
    enabled: true,
    color: color.startsWith("rgba") ? "#000000" : color,
    opacity,
    blur: shadow.blur ?? 12,
    distance,
    angle,
    preset: "custom",
  };
}

export function normalizeShadowMeta(meta: ObjectShadowMeta): ObjectShadowMeta {
  return {
    enabled: meta.enabled,
    color: meta.color,
    opacity: meta.opacity,
    blur: meta.blur,
    distance: meta.distance,
    angle: meta.angle,
    preset: meta.preset,
  };
}
