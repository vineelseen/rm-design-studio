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
    offsetX: 0,
    offsetY: 0,
    preset: "none",
  },
  subtle: {
    enabled: true,
    color: "#000000",
    opacity: 0.1,
    blur: 8,
    offsetX: 0,
    offsetY: 3,
    preset: "subtle",
  },
  medium: {
    enabled: true,
    color: "#000000",
    opacity: 0.18,
    blur: 14,
    offsetX: 0,
    offsetY: 6,
    preset: "medium",
  },
  strong: {
    enabled: true,
    color: "#000000",
    opacity: 0.25,
    blur: 24,
    offsetX: 0,
    offsetY: 10,
    preset: "strong",
  },
};

export function shadowMetaToFabric(meta: ObjectShadowMeta): Shadow | null {
  if (!meta.enabled) return null;

  const rgba = hexToRgba(meta.color, meta.opacity);
  return new Shadow({
    color: rgba,
    blur: meta.blur,
    offsetX: meta.offsetX,
    offsetY: meta.offsetY,
  });
}

function hexToRgba(hex: string, opacity: number): string {
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
