"use client";

import { SHADOW_PRESETS } from "@/lib/canvas/shadow-utils";
import type { ObjectShadowMeta, SelectedObjectMeta } from "@/types/project";
import { PanelSection } from "@/components/ui";

type EffectControlsProps = {
  selectedObject: SelectedObjectMeta;
  update: (updates: Partial<SelectedObjectMeta>) => void;
};

export function EffectControls({ selectedObject, update }: EffectControlsProps) {
  const shadow = selectedObject.shadow ?? SHADOW_PRESETS.none;

  const setShadow = (next: ObjectShadowMeta) => update({ shadow: next });

  return (
    <PanelSection title="Effects">
      <label className="flex items-center justify-between gap-3">
        <span className="font-body text-sm font-semibold text-rm-neutral-700">
          Drop Shadow
        </span>
        <input
          type="checkbox"
          checked={shadow.enabled}
          onChange={(event) =>
            setShadow(
              event.target.checked
                ? { ...SHADOW_PRESETS.medium, enabled: true }
                : { ...SHADOW_PRESETS.none, enabled: false },
            )
          }
        />
      </label>

      {shadow.enabled ? (
        <>
          <div className="flex flex-wrap gap-1">
            {(["none", "subtle", "medium", "strong"] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setShadow(SHADOW_PRESETS[preset])}
                className={`rounded-sm border px-2 py-1 font-body text-xs capitalize ${
                  shadow.preset === preset
                    ? "border-rm-blue-600 bg-rm-blue-50 text-rm-blue-600"
                    : "border-rm-neutral-300 text-rm-neutral-700"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Shadow Color
            </span>
            <input
              type="color"
              value={shadow.color}
              onChange={(event) =>
                setShadow({ ...shadow, color: event.target.value, preset: "custom" })
              }
              className="h-8 w-full rounded-sm border border-rm-neutral-300"
            />
          </label>

          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Opacity
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={shadow.opacity}
              onChange={(event) =>
                setShadow({
                  ...shadow,
                  opacity: Number(event.target.value),
                  preset: "custom",
                })
              }
              className="w-full"
            />
          </label>

          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Blur
            </span>
            <input
              type="number"
              value={shadow.blur}
              onChange={(event) =>
                setShadow({
                  ...shadow,
                  blur: Number(event.target.value),
                  preset: "custom",
                })
              }
              className="h-8 w-full rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="font-body text-sm font-semibold text-rm-neutral-700">
                X Offset
              </span>
              <input
                type="number"
                value={shadow.offsetX}
                onChange={(event) =>
                  setShadow({
                    ...shadow,
                    offsetX: Number(event.target.value),
                    preset: "custom",
                  })
                }
                className="h-8 w-full rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-body text-sm font-semibold text-rm-neutral-700">
                Y Offset
              </span>
              <input
                type="number"
                value={shadow.offsetY}
                onChange={(event) =>
                  setShadow({
                    ...shadow,
                    offsetY: Number(event.target.value),
                    preset: "custom",
                  })
                }
                className="h-8 w-full rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
              />
            </label>
          </div>
        </>
      ) : null}
    </PanelSection>
  );
}
