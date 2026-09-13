"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  Copy,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui";
import { FONT_OPTIONS } from "@/lib/canvas-constants";
import { useDesignEditorStore, useProjectStore } from "@/store";

export function ContextualToolbar() {
  const mode = useDesignEditorStore((state) => state.mode);
  const selectedObject = useDesignEditorStore((state) => state.selectedObject);
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const syncCurrentPageToProject = useProjectStore(
    (state) => state.syncCurrentPageToProject,
  );
  const setCurrentPageMode = useProjectStore((state) => state.setCurrentPageMode);
  const selectedPage = useProjectStore((state) => state.getSelectedPage());

  const switchMode = (nextMode: "template" | "designer") => {
    syncCurrentPageToProject();
    setCurrentPageMode(nextMode);
  };

  const update = (updates: Parameters<NonNullable<typeof canvasController>["updateActiveObject"]>[0]) => {
    canvasController?.updateActiveObject(updates);
  };

  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-rm-neutral-200 bg-rm-white px-4">
      <div className="flex items-center gap-1 rounded-sm border border-rm-neutral-200 p-0.5">
        <button
          type="button"
          onClick={() => switchMode("template")}
          className={`h-7 rounded-sm px-3 font-body text-xs font-semibold ${
            mode === "template"
              ? "bg-rm-blue-600 text-rm-white"
              : "text-rm-neutral-600 hover:bg-rm-neutral-50"
          }`}
        >
          Template
        </button>
        <button
          type="button"
          onClick={() => switchMode("designer")}
          className={`h-7 rounded-sm px-3 font-body text-xs font-semibold ${
            mode === "designer"
              ? "bg-rm-blue-600 text-rm-white"
              : "text-rm-neutral-600 hover:bg-rm-neutral-50"
          }`}
        >
          Designer
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">
        {!selectedObject || mode === "template" || !selectedPage ? (
          <span className="font-body text-xs text-rm-neutral-500">
            A4 Portrait · 210 × 297 mm
          </span>
        ) : null}

        {selectedObject?.type === "text" && mode === "designer" ? (
          <>
            <select
              value={selectedObject.fontFamily ?? FONT_OPTIONS[0].value}
              onChange={(e) => update({ fontFamily: e.target.value })}
              className="h-7 rounded-sm border border-rm-neutral-300 px-2 font-body text-xs"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={selectedObject.fontSize ?? 28}
              onChange={(e) => update({ fontSize: Number(e.target.value) })}
              className="h-7 w-14 rounded-sm border border-rm-neutral-300 px-2 font-body text-xs"
            />
            <Button
              variant={String(selectedObject.fontWeight) === "600" ? "primary" : "ghost"}
              onClick={() =>
                update({
                  fontWeight: String(selectedObject.fontWeight) === "600" ? "400" : "600",
                })
              }
              title="Bold"
            >
              <Bold className="size-3.5" />
            </Button>
            <Button variant="ghost" onClick={() => update({ textAlign: "left" })} title="Align left">
              <AlignLeft className="size-3.5" />
            </Button>
            <Button variant="ghost" onClick={() => update({ textAlign: "center" })} title="Align center">
              <AlignCenter className="size-3.5" />
            </Button>
            <Button variant="ghost" onClick={() => update({ textAlign: "right" })} title="Align right">
              <AlignRight className="size-3.5" />
            </Button>
            <input
              type="color"
              value={selectedObject.fill ?? "#171D28"}
              onChange={(e) => update({ fill: e.target.value })}
              className="h-7 w-8 cursor-pointer rounded-sm border border-rm-neutral-300"
              title="Text color"
            />
          </>
        ) : null}

        {(selectedObject?.type === "rect" ||
          selectedObject?.type === "circle" ||
          selectedObject?.type === "triangle") &&
        mode === "designer" ? (
          <>
            <input
              type="color"
              value={selectedObject.fill ?? "#0F52BA"}
              onChange={(e) => update({ fill: e.target.value })}
              className="h-7 w-8 cursor-pointer rounded-sm border border-rm-neutral-300"
              title="Fill"
            />
            <input
              type="color"
              value={selectedObject.stroke ?? "#0F52BA"}
              onChange={(e) => update({ stroke: e.target.value })}
              className="h-7 w-8 cursor-pointer rounded-sm border border-rm-neutral-300"
              title="Stroke"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedObject.opacity ?? 1}
              onChange={(e) => update({ opacity: Number(e.target.value) })}
              className="w-20"
              title="Opacity"
            />
          </>
        ) : null}

        {selectedObject?.type === "line" && mode === "designer" ? (
          <input
            type="color"
            value={selectedObject.stroke ?? "#0F52BA"}
            onChange={(e) => update({ stroke: e.target.value })}
            className="h-7 w-8 cursor-pointer rounded-sm border border-rm-neutral-300"
            title="Stroke"
          />
        ) : null}

        {(selectedObject?.type === "image" || selectedObject?.type === "group") &&
        mode === "designer" ? (
          <>
            <Button variant="ghost" onClick={() => void canvasController?.duplicateSelected()} title="Duplicate">
              <Copy className="size-3.5" />
            </Button>
            <Button variant="ghost" onClick={() => canvasController?.bringForward()} title="Bring forward">
              <ArrowUp className="size-3.5" />
            </Button>
            <Button variant="ghost" onClick={() => canvasController?.sendBackward()} title="Send backward">
              <ArrowDown className="size-3.5" />
            </Button>
            <Button variant="ghost" onClick={() => canvasController?.deleteSelected()} title="Delete">
              <Trash2 className="size-3.5" />
            </Button>
          </>
        ) : null}
      </div>

      <div className="hidden w-32 shrink-0 sm:block" aria-hidden="true" />
    </div>
  );
}
