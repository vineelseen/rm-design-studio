"use client";

import {
  Circle,
  Eye,
  EyeOff,
  ImageIcon,
  Lock,
  Minus,
  Square,
  Triangle,
  Type,
  Unlock,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { useDesignEditorStore } from "@/store";
import type { LayerItem } from "@/types/project";

function LayerIcon({ type }: { type: LayerItem["type"] }) {
  switch (type) {
    case "text":
      return <Type className="size-3.5" />;
    case "circle":
      return <Circle className="size-3.5" />;
    case "triangle":
      return <Triangle className="size-3.5" />;
    case "line":
      return <Minus className="size-3.5" />;
    case "image":
    case "group":
      return <ImageIcon className="size-3.5" />;
    default:
      return <Square className="size-3.5" />;
  }
}

export function LayersPanel() {
  const layers = useDesignEditorStore((state) => state.layers);
  const selectedObject = useDesignEditorStore((state) => state.selectedObject);
  const canvasController = useDesignEditorStore((state) => state.canvasController);

  if (!canvasController) {
    return (
      <p className="font-body text-sm text-rm-neutral-500">
        Open a designer page to view layers.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
        Layers
      </p>

      {layers.length === 0 ? (
        <p className="font-body text-sm text-rm-neutral-500">
          No objects on this page yet.
        </p>
      ) : (
        <ul className="space-y-1">
          {layers.map((layer) => {
            const isSelected = selectedObject?.id === layer.id;
            return (
              <li
                key={layer.id}
                className={cn(
                  "group flex items-center gap-2 rounded-sm border px-2 py-1.5",
                  isSelected
                    ? "border-rm-blue-600 bg-rm-blue-50"
                    : "border-rm-neutral-200 hover:border-rm-neutral-300",
                )}
              >
                <button
                  type="button"
                  onClick={() => canvasController.selectLayer(layer.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="text-rm-neutral-500">
                    <LayerIcon type={layer.type} />
                  </span>
                  <span className="truncate font-body text-sm text-rm-neutral-800">
                    {layer.locked ? "🔒 " : ""}
                    {layer.name}
                  </span>
                </button>

                <button
                  type="button"
                  title={layer.visible ? "Hide layer" : "Show layer"}
                  onClick={() =>
                    canvasController.setLayerVisibility(layer.id, !layer.visible)
                  }
                  className="rounded-sm p-1 text-rm-neutral-400 hover:bg-rm-neutral-100 hover:text-rm-neutral-700"
                >
                  {layer.visible ? (
                    <Eye className="size-3.5" />
                  ) : (
                    <EyeOff className="size-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  title={layer.locked ? "Unlock layer" : "Lock layer"}
                  onClick={() =>
                    canvasController.setLayerLocked(layer.id, !layer.locked)
                  }
                  className="rounded-sm p-1 text-rm-neutral-400 hover:bg-rm-neutral-100 hover:text-rm-neutral-700"
                >
                  {layer.locked ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Unlock className="size-3.5" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
