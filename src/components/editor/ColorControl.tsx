"use client";

import { RM_COLOR_SWATCHES } from "@/lib/canvas-constants";

type ColorControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showFill?: boolean;
  showStroke?: boolean;
  fillValue?: string;
  strokeValue?: string;
  onFillChange?: (value: string) => void;
  onStrokeChange?: (value: string) => void;
};

export function ColorControl({
  label,
  value,
  onChange,
  showFill = false,
  showStroke = false,
  fillValue,
  strokeValue,
  onFillChange,
  onStrokeChange,
}: ColorControlProps) {
  return (
    <div className="space-y-2">
      <span className="block font-body text-sm font-semibold leading-5 text-rm-neutral-700">
        {label}
      </span>

      <div className="flex flex-wrap gap-2">
        {RM_COLOR_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            aria-label={`Use color ${swatch}`}
            className="size-6 rounded-sm border border-rm-neutral-300"
            style={{ backgroundColor: swatch }}
            onClick={() => onChange(swatch)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-10 cursor-pointer rounded-sm border border-rm-neutral-300 bg-rm-white"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex h-8 flex-1 rounded-sm border border-rm-neutral-300 bg-rm-white px-2 font-body text-xs text-rm-neutral-900"
        />
      </div>

      {showFill && onFillChange ? (
        <div className="flex items-center gap-2">
          <span className="w-12 font-body text-xs text-rm-neutral-600">Fill</span>
          <input
            type="color"
            value={fillValue ?? "#0F52BA"}
            onChange={(event) => onFillChange(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded-sm border border-rm-neutral-300 bg-rm-white"
          />
        </div>
      ) : null}

      {showStroke && onStrokeChange ? (
        <div className="flex items-center gap-2">
          <span className="w-12 font-body text-xs text-rm-neutral-600">Stroke</span>
          <input
            type="color"
            value={strokeValue ?? "#0F52BA"}
            onChange={(event) => onStrokeChange(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded-sm border border-rm-neutral-300 bg-rm-white"
          />
        </div>
      ) : null}
    </div>
  );
}
