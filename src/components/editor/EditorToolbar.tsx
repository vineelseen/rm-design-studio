"use client";

import {
  ArrowDown,
  ArrowUp,
  Circle,
  Copy,
  MousePointer2,
  Square,
  Trash2,
  Type,
  Upload,
  Minus,
} from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui";
import { useDesignEditorStore, useProjectStore, type EditorTool } from "@/store";

const TOOL_BUTTONS: Array<{ id: EditorTool; label: string; icon: React.ReactNode }> = [
  { id: "select", label: "Select", icon: <MousePointer2 className="size-3.5" /> },
  { id: "text", label: "Text", icon: <Type className="size-3.5" /> },
  { id: "rectangle", label: "Rectangle", icon: <Square className="size-3.5" /> },
  { id: "circle", label: "Circle", icon: <Circle className="size-3.5" /> },
  { id: "line", label: "Line", icon: <Minus className="size-3.5" /> },
];

export function EditorToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTool = useDesignEditorStore((state) => state.activeTool);
  const setActiveTool = useDesignEditorStore((state) => state.setActiveTool);
  const mode = useDesignEditorStore((state) => state.mode);
  const setMode = useDesignEditorStore((state) => state.setMode);
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const updateActiveProjectDraft = useProjectStore(
    (state) => state.updateActiveProjectDraft,
  );

  const runTool = (tool: EditorTool) => {
    setActiveTool(tool);

    if (!canvasController) {
      return;
    }

    switch (tool) {
      case "text":
        canvasController.addText();
        break;
      case "rectangle":
        canvasController.addRectangle();
        break;
      case "circle":
        canvasController.addCircle();
        break;
      case "line":
        canvasController.addLine();
        break;
      case "upload":
        fileInputRef.current?.click();
        break;
      default:
        break;
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvasController) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "svg") {
      const text = await file.text();
      await canvasController.addSvgFromString(text);
    } else if (
      extension === "png" ||
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "webp"
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          void canvasController.addImageFromDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }

    event.target.value = "";
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-rm-neutral-200 bg-rm-white px-4 py-2">
      <div className="flex items-center gap-1">
        <div className="mr-2 flex items-center gap-1 rounded-sm border border-rm-neutral-200 p-0.5">
          <button
            type="button"
            onClick={() => {
              const json = canvasController?.toJSON();
              if (json) {
                updateActiveProjectDraft(json);
              }
              setMode("template");
            }}
            className={`h-7 rounded-sm px-2 font-body text-xs font-semibold ${
              mode === "template"
                ? "bg-rm-blue-600 text-rm-white"
                : "text-rm-neutral-600 hover:bg-rm-neutral-50"
            }`}
          >
            Template
          </button>
          <button
            type="button"
            onClick={() => {
              const json = canvasController?.toJSON();
              if (json) {
                updateActiveProjectDraft(json);
              }
              setMode("designer");
            }}
            className={`h-7 rounded-sm px-2 font-body text-xs font-semibold ${
              mode === "designer"
                ? "bg-rm-blue-600 text-rm-white"
                : "text-rm-neutral-600 hover:bg-rm-neutral-50"
            }`}
          >
            Designer
          </button>
        </div>

        {TOOL_BUTTONS.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "primary" : "ghost"}
            onClick={() => runTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
            <span className="hidden xl:inline">{tool.label}</span>
          </Button>
        ))}

        <Button variant="ghost" onClick={() => runTool("upload")} title="Upload">
          <Upload className="size-3.5" />
          <span className="hidden xl:inline">Upload</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          onClick={() => canvasController?.bringForward()}
          title="Bring Forward"
        >
          <ArrowUp className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => canvasController?.sendBackward()}
          title="Send Backward"
        >
          <ArrowDown className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => void canvasController?.duplicateSelected()}
          title="Duplicate"
        >
          <Copy className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => canvasController?.deleteSelected()}
          title="Delete"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
