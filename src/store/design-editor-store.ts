import { create } from "zustand";

import type { CanvasController } from "@/lib/canvas-controller";
import type { EditorMode, SelectedObjectMeta } from "@/types/project";

export type EditorTool =
  | "select"
  | "text"
  | "rectangle"
  | "circle"
  | "line"
  | "upload";

type DesignEditorState = {
  mode: EditorMode;
  activeTool: EditorTool;
  canvasController: CanvasController | null;
  selectedObject: SelectedObjectMeta | null;
  setMode: (mode: EditorMode) => void;
  setActiveTool: (tool: EditorTool) => void;
  setCanvasController: (controller: CanvasController | null) => void;
  setSelectedObject: (meta: SelectedObjectMeta | null) => void;
};

export const useDesignEditorStore = create<DesignEditorState>((set) => ({
  mode: "designer",
  activeTool: "select",
  canvasController: null,
  selectedObject: null,
  setMode: (mode) => set({ mode }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setCanvasController: (controller) => set({ canvasController: controller }),
  setSelectedObject: (meta) => set({ selectedObject: meta }),
}));
