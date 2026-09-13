"use client";

import { useCallback, useEffect, useRef } from "react";

import { SHADOW_PRESETS } from "@/lib/canvas/shadow-utils";
import type { CanvasController } from "@/lib/canvas-controller";
import type { ObjectShadowMeta, SelectedObjectMeta } from "@/types/project";
import { PanelSection } from "@/components/ui";

type EffectControlsProps = {
  selectedObject: SelectedObjectMeta;
  canvasController: CanvasController;
  onShadowChange: (shadow: ObjectShadowMeta) => void;
};

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  onGestureStart,
  onGestureEnd,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onGestureStart: () => void;
  onGestureEnd: () => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-semibold text-rm-neutral-700">
          {label}
        </span>
        {suffix ? (
          <span className="font-body text-xs text-rm-neutral-500">{suffix}</span>
        ) : null}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={onGestureStart}
        onPointerUp={onGestureEnd}
        onPointerCancel={onGestureEnd}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onFocus={onGestureStart}
        onBlur={onGestureEnd}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-8 w-full rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
      />
    </div>
  );
}

export function EffectControls({
  selectedObject,
  canvasController,
  onShadowChange,
}: EffectControlsProps) {
  const shadow = selectedObject.shadow ?? SHADOW_PRESETS.none;
  const gestureActiveRef = useRef(false);

  const beginGesture = useCallback(() => {
    if (gestureActiveRef.current) return;
    gestureActiveRef.current = true;
    canvasController.beginShadowGesture();
  }, [canvasController]);

  const endGesture = useCallback(() => {
    if (!gestureActiveRef.current) return;
    gestureActiveRef.current = false;
    canvasController.commitShadowGesture();
  }, [canvasController]);

  useEffect(() => {
    return () => {
      if (gestureActiveRef.current) {
        gestureActiveRef.current = false;
        canvasController.commitShadowGesture();
      }
    };
  }, [canvasController]);

  const applyShadowLive = (next: ObjectShadowMeta) => {
    canvasController.applyShadowLive(next);
    onShadowChange(next);
  };

  const opacityPercent = Math.round(shadow.opacity * 100);

  return (
    <PanelSection title="Effects">
      <label className="flex items-center justify-between gap-3">
        <span className="font-body text-sm font-semibold text-rm-neutral-700">
          Drop Shadow
        </span>
        <input
          type="checkbox"
          checked={shadow.enabled}
          onChange={(event) => {
            const next = event.target.checked
              ? { ...SHADOW_PRESETS.medium, enabled: true }
              : { ...SHADOW_PRESETS.none, enabled: false };
            canvasController.applyShadowCommit(next);
            onShadowChange(next);
          }}
        />
      </label>

      {shadow.enabled ? (
        <>
          <div className="flex flex-wrap gap-1">
            {(["none", "subtle", "medium", "strong"] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const next = SHADOW_PRESETS[preset];
                  canvasController.applyShadowPreset(preset);
                  onShadowChange(next);
                }}
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
              Color
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                value={shadow.color}
                onPointerDown={beginGesture}
                onPointerUp={endGesture}
                onChange={(event) =>
                  applyShadowLive({
                    ...shadow,
                    color: event.target.value,
                    preset: "custom",
                  })
                }
                className="h-8 w-12 rounded-sm border border-rm-neutral-300"
              />
              <input
                type="text"
                value={shadow.color}
                onFocus={beginGesture}
                onBlur={endGesture}
                onChange={(event) =>
                  applyShadowLive({
                    ...shadow,
                    color: event.target.value,
                    preset: "custom",
                  })
                }
                className="h-8 flex-1 rounded-sm border border-rm-neutral-300 px-2 font-body text-sm uppercase"
              />
            </div>
          </label>

          <SliderField
            label="Opacity"
            value={opacityPercent}
            min={0}
            max={100}
            onGestureStart={beginGesture}
            onGestureEnd={endGesture}
            suffix={`${opacityPercent}%`}
            onChange={(value) =>
              applyShadowLive({
                ...shadow,
                opacity: value / 100,
                preset: "custom",
              })
            }
          />

          <SliderField
            label="Blur"
            value={shadow.blur}
            min={0}
            max={50}
            onGestureStart={beginGesture}
            onGestureEnd={endGesture}
            onChange={(value) =>
              applyShadowLive({
                ...shadow,
                blur: value,
                preset: "custom",
              })
            }
          />

          <SliderField
            label="Distance"
            value={shadow.distance}
            min={0}
            max={50}
            onGestureStart={beginGesture}
            onGestureEnd={endGesture}
            onChange={(value) =>
              applyShadowLive({
                ...shadow,
                distance: value,
                preset: "custom",
              })
            }
          />

          <SliderField
            label="Angle"
            value={Math.round(shadow.angle)}
            min={0}
            max={360}
            onGestureStart={beginGesture}
            onGestureEnd={endGesture}
            suffix={`${Math.round(shadow.angle)}°`}
            onChange={(value) =>
              applyShadowLive({
                ...shadow,
                angle: value,
                preset: "custom",
              })
            }
          />
        </>
      ) : null}
    </PanelSection>
  );
}
