"use client";

import { FONT_OPTIONS } from "@/lib/canvas-constants";
import { Field, InputField, PanelSection } from "@/components/ui";
import { useDesignEditorStore } from "@/store";
import type { SelectedObjectMeta } from "@/types/project";
import { ColorControl } from "./ColorControl";
import { EffectControls } from "./EffectControls";

const CORNER_RADIUS_PRESETS = [0, 4, 8, 12, 16];

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <InputField
      label={label}
      value={String(value)}
      onChange={(next) => {
        const parsed = Number(next);
        if (!Number.isNaN(parsed)) onChange(parsed);
      }}
    />
  );
}

function TransformSection({
  selectedObject,
  update,
  showOpacity = true,
}: {
  selectedObject: SelectedObjectMeta;
  update: (updates: Partial<SelectedObjectMeta>) => void;
  showOpacity?: boolean;
}) {
  return (
    <PanelSection title="Transform">
      <NumberField
        label="X"
        value={selectedObject.left}
        onChange={(value) => update({ left: value })}
      />
      <NumberField
        label="Y"
        value={selectedObject.top}
        onChange={(value) => update({ top: value })}
      />
      <NumberField
        label="Width"
        value={selectedObject.width}
        onChange={(value) => update({ width: value })}
      />
      <NumberField
        label="Height"
        value={selectedObject.height}
        onChange={(value) => update({ height: value })}
      />
      <NumberField
        label="Rotation"
        value={selectedObject.angle}
        onChange={(value) => update({ angle: value })}
      />
      {showOpacity ? (
        <label className="block space-y-1">
          <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
            Opacity
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedObject.opacity ?? 1}
            onChange={(e) => update({ opacity: Number(e.target.value) })}
            className="w-full"
          />
        </label>
      ) : null}
    </PanelSection>
  );
}

function MultiSelectionPanel({
  count,
  canvasController,
}: {
  count: number;
  canvasController: NonNullable<
    ReturnType<typeof useDesignEditorStore.getState>["canvasController"]
  >;
}) {
  return (
    <>
      <PanelSection title="Multiple Selection">
        <Field label="Objects selected" value={String(count)} />
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!canvasController.canGroup()}
            onClick={() => void canvasController.groupSelected()}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50 disabled:opacity-50"
          >
            Group
          </button>
          <button
            type="button"
            onClick={() => canvasController.lockSelected()}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50"
          >
            Lock
          </button>
          <button
            type="button"
            onClick={() => canvasController.alignSelection("left")}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50"
          >
            Align Left
          </button>
          <button
            type="button"
            onClick={() => canvasController.alignSelection("center")}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50"
          >
            Align Center
          </button>
          <button
            type="button"
            disabled={!canvasController.canDistribute()}
            onClick={() => canvasController.distributeSelection("horizontal")}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50 disabled:opacity-50"
          >
            Distribute H
          </button>
          <button
            type="button"
            disabled={!canvasController.canDistribute()}
            onClick={() => canvasController.distributeSelection("vertical")}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50 disabled:opacity-50"
          >
            Distribute V
          </button>
          <button
            type="button"
            onClick={() => canvasController.bringForward()}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50"
          >
            Bring Forward
          </button>
          <button
            type="button"
            onClick={() => canvasController.sendBackward()}
            className="rounded-sm border border-rm-neutral-300 px-2 py-1.5 font-body text-xs hover:bg-rm-neutral-50"
          >
            Send Backward
          </button>
        </div>
      </PanelSection>
    </>
  );
}

export function ObjectProperties() {
  const selectedObject = useDesignEditorStore((state) => state.selectedObject);
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const patchSelectedShadow = useDesignEditorStore(
    (state) => state.patchSelectedShadow,
  );

  const update = (updates: Partial<SelectedObjectMeta>) => {
    if (!selectedObject || !canvasController) return;
    canvasController.updateActiveObject(updates);
  };

  if (!selectedObject) {
    return (
      <PanelSection title="Document" className="border-b-0 pb-0">
        <Field label="Format" value="A4 Portrait" />
        <Field label="Size" value="210 × 297 mm" />
      </PanelSection>
    );
  }

  if (selectedObject.isMultiSelect && canvasController) {
    return (
      <MultiSelectionPanel
        count={selectedObject.selectionCount ?? 0}
        canvasController={canvasController}
      />
    );
  }

  const supportsShadow =
    selectedObject.type === "text" ||
    selectedObject.type === "rect" ||
    selectedObject.type === "circle" ||
    selectedObject.type === "image" ||
    selectedObject.type === "group";

  return (
    <>
      {selectedObject.type === "text" ? (
        <PanelSection title="Text">
          <InputField
            label="Content"
            value={selectedObject.text ?? ""}
            onChange={(value) => update({ text: value })}
          />
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Font
            </span>
            <select
              value={selectedObject.fontFamily ?? FONT_OPTIONS[0].value}
              onChange={(event) => update({ fontFamily: event.target.value })}
              className="flex h-8 w-full rounded-sm border border-rm-neutral-300 bg-rm-white px-2 font-body text-sm text-rm-neutral-900"
            >
              {FONT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <NumberField
            label="Size"
            value={selectedObject.fontSize ?? 28}
            onChange={(value) => update({ fontSize: value })}
          />
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Weight
            </span>
            <select
              value={String(selectedObject.fontWeight ?? "400")}
              onChange={(event) => update({ fontWeight: event.target.value })}
              className="flex h-8 w-full rounded-sm border border-rm-neutral-300 bg-rm-white px-2 font-body text-sm text-rm-neutral-900"
            >
              <option value="400">Regular</option>
              <option value="600">Semibold</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Alignment
            </span>
            <div className="flex gap-2">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => update({ textAlign: align })}
                  className={`h-8 flex-1 rounded-sm border font-body text-xs capitalize ${
                    selectedObject.textAlign === align
                      ? "border-rm-blue-600 bg-rm-blue-50 text-rm-blue-600"
                      : "border-rm-neutral-300 bg-rm-white text-rm-neutral-700"
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </label>
          <ColorControl
            label="Color"
            value={selectedObject.fill ?? "#171D28"}
            onChange={(value) => update({ fill: value })}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "rect" ? (
        <PanelSection title="Shape">
          <ColorControl
            label="Fill"
            value={selectedObject.fill ?? "#0F52BA"}
            onChange={(value) => update({ fill: value })}
          />
          <ColorControl
            label="Stroke"
            value={selectedObject.stroke ?? "#0F52BA"}
            onChange={(value) => update({ stroke: value })}
          />
          <NumberField
            label="Stroke width"
            value={selectedObject.strokeWidth ?? 1}
            onChange={(value) => update({ strokeWidth: value })}
          />
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Corner Radius
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={selectedObject.cornerRadius ?? 0}
              onChange={(event) =>
                update({ cornerRadius: Number(event.target.value) })
              }
              className="h-8 w-full rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
            />
            <div className="flex flex-wrap gap-1">
              {CORNER_RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => update({ cornerRadius: preset })}
                  className={`rounded-sm border px-2 py-1 font-body text-xs ${
                    selectedObject.cornerRadius === preset
                      ? "border-rm-blue-600 bg-rm-blue-50 text-rm-blue-600"
                      : "border-rm-neutral-300 text-rm-neutral-700"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </label>
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Opacity
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedObject.opacity ?? 1}
              onChange={(e) => update({ opacity: Number(e.target.value) })}
              className="w-full"
            />
          </label>
        </PanelSection>
      ) : null}

      {selectedObject.type === "circle" || selectedObject.type === "triangle" ? (
        <PanelSection title="Shape">
          <ColorControl
            label="Fill"
            value={selectedObject.fill ?? "#0F52BA"}
            onChange={(value) => update({ fill: value })}
          />
          <ColorControl
            label="Stroke"
            value={selectedObject.stroke ?? "#0F52BA"}
            onChange={(value) => update({ stroke: value })}
          />
          <NumberField
            label="Stroke width"
            value={selectedObject.strokeWidth ?? 1}
            onChange={(value) => update({ strokeWidth: value })}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "line" ? (
        <PanelSection title="Shape">
          <ColorControl
            label="Stroke"
            value={selectedObject.stroke ?? "#0F52BA"}
            onChange={(value) => update({ stroke: value })}
          />
          <NumberField
            label="Stroke width"
            value={selectedObject.strokeWidth ?? 3}
            onChange={(value) => update({ strokeWidth: value })}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "image" ? (
        <PanelSection title="Image">
          <Field
            label="Filename"
            value={selectedObject.filename ?? "Uploaded image"}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "group" ? (
        <PanelSection title="Group">
          <Field
            label="Object count"
            value={String(selectedObject.groupObjectCount ?? 0)}
          />
          <InputField
            label="Name"
            value={selectedObject.name ?? "Group"}
            onChange={(value) => update({ name: value })}
          />
        </PanelSection>
      ) : null}

      {supportsShadow && canvasController ? (
        <EffectControls
          selectedObject={selectedObject}
          canvasController={canvasController}
          onShadowChange={patchSelectedShadow}
        />
      ) : null}

      <TransformSection
        selectedObject={selectedObject}
        update={update}
        showOpacity={selectedObject.type !== "line" && selectedObject.type !== "rect"}
      />
    </>
  );
}
