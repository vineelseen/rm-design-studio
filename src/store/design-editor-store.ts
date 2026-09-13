import { create } from "zustand";

import type { CanvasController } from "@/lib/canvas-controller";
import type {
  EditorMode,
  LayerItem,
  SelectedObjectMeta,
  SnapGuide,
  ToolPanelId,
} from "@/types/project";

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
  activePanel: ToolPanelId | null;
  canvasController: CanvasController | null;
  selectedObject: SelectedObjectMeta | null;
  layers: LayerItem[];
  snapGuides: SnapGuide[];
  setMode: (mode: EditorMode) => void;
  setActiveTool: (tool: EditorTool) => void;
  setActivePanel: (panel: ToolPanelId | null) => void;
  togglePanel: (panel: ToolPanelId) => void;
  setCanvasController: (controller: CanvasController | null) => void;
  setSelectedObject: (meta: SelectedObjectMeta | null) => void;
  setLayers: (layers: LayerItem[]) => void;
  setSnapGuides: (guides: SnapGuide[]) => void;
};

export const useDesignEditorStore = create<DesignEditorState>((set, get) => ({
  mode: "designer",
  activeTool: "select",
  activePanel: "design",
  canvasController: null,
  selectedObject: null,
  layers: [],
  snapGuides: [],
  setMode: (mode) => set({ mode }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  togglePanel: (panel) =>
    set({ activePanel: get().activePanel === panel ? null : panel }),
  setCanvasController: (controller) => set({ canvasController: controller }),
  setSelectedObject: (meta) => set({ selectedObject: meta }),
  setLayers: (layers) => set({ layers }),
  setSnapGuides: (nextGuides) => set({ snapGuides: nextGuides }),
}));
