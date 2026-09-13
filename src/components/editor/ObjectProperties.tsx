"use client";

import { FONT_OPTIONS } from "@/lib/canvas-constants";
import { Field, InputField, PanelSection } from "@/components/ui";
import { useDesignEditorStore } from "@/store";
import type { SelectedObjectMeta } from "@/types/project";
import { ColorControl } from "./ColorControl";

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
        if (!Number.isNaN(parsed)) {
          onChange(parsed);
        }
      }}
    />
  );
}

export function ObjectProperties() {
  const selectedObject = useDesignEditorStore((state) => state.selectedObject);
  const canvasController = useDesignEditorStore((state) => state.canvasController);

  const update = (updates: Partial<SelectedObjectMeta>) => {
    if (!selectedObject || !canvasController) {
      return;
    }

    canvasController.updateActiveObject(updates);
  };

  if (!selectedObject) {
    return (
      <>
        <PanelSection title="Page">
          <Field label="Canvas" value="A4 Portrait" />
          <Field label="Size" value="595 × 842 px" />
        </PanelSection>
        <PanelSection title="Selection" className="border-b-0 pb-0">
          <Field label="Status" value="No object selected" />
        </PanelSection>
      </>
    );
  }

  return (
    <>
      <PanelSection title="Position">
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
      </PanelSection>

      {selectedObject.type === "text" ? (
        <PanelSection title="Text">
          <InputField
            label="Content"
            value={selectedObject.text ?? ""}
            onChange={(value) => update({ text: value })}
          />
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Font family
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
            label="Font size"
            value={selectedObject.fontSize ?? 28}
            onChange={(value) => update({ fontSize: value })}
          />
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
              Font weight
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
            label="Text color"
            value={selectedObject.fill ?? "#171D28"}
            onChange={(value) => update({ fill: value })}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "rect" || selectedObject.type === "circle" ? (
        <PanelSection title="Shape">
          <ColorControl
            label="Fill color"
            value={selectedObject.fill ?? "#0F52BA"}
            onChange={(value) => update({ fill: value })}
            showFill
            fillValue={selectedObject.fill ?? "#0F52BA"}
            onFillChange={(value) => update({ fill: value })}
            showStroke
            strokeValue={selectedObject.stroke ?? "#0F52BA"}
            onStrokeChange={(value) => update({ stroke: value })}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "line" ? (
        <PanelSection title="Line">
          <ColorControl
            label="Stroke color"
            value={selectedObject.stroke ?? "#0F52BA"}
            onChange={(value) => update({ stroke: value })}
          />
        </PanelSection>
      ) : null}

      {selectedObject.type === "image" || selectedObject.type === "group" ? (
        <PanelSection title="Image" className="border-b-0 pb-0">
          <Field
            label="Type"
            value={selectedObject.type === "group" ? "SVG group" : "Raster image"}
          />
        </PanelSection>
      ) : null}
    </>
  );
}
