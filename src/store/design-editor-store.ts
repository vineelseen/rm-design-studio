import { create } from "zustand";

import type { CanvasController } from "@/lib/canvas-controller";
import type {
  EditorMode,
  LayerItem,
  ObjectShadowMeta,
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
  canUndo: boolean;
  canRedo: boolean;
  setMode: (mode: EditorMode) => void;
  setActiveTool: (tool: EditorTool) => void;
  setActivePanel: (panel: ToolPanelId | null) => void;
  togglePanel: (panel: ToolPanelId) => void;
  setCanvasController: (controller: CanvasController | null) => void;
  setSelectedObject: (meta: SelectedObjectMeta | null) => void;
  setLayers: (layers: LayerItem[]) => void;
  setSnapGuides: (guides: SnapGuide[]) => void;
  setHistoryState: (state: { canUndo: boolean; canRedo: boolean }) => void;
  patchSelectedShadow: (shadow: ObjectShadowMeta) => void;
};

export const useDesignEditorStore = create<DesignEditorState>((set, get) => ({
  mode: "designer",
  activeTool: "select",
  activePanel: "design",
  canvasController: null,
  selectedObject: null,
  layers: [],
  snapGuides: [],
  canUndo: false,
  canRedo: false,
  setMode: (mode) => set({ mode }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  togglePanel: (panel) =>
    set({ activePanel: get().activePanel === panel ? null : panel }),
  setCanvasController: (controller) => set({ canvasController: controller }),
  setSelectedObject: (meta) => set({ selectedObject: meta }),
  setLayers: (layers) => set({ layers }),
  setSnapGuides: (nextGuides) => set({ snapGuides: nextGuides }),
  setHistoryState: ({ canUndo, canRedo }) => set({ canUndo, canRedo }),
  patchSelectedShadow: (shadow) =>
    set((state) => ({
      selectedObject: state.selectedObject
        ? { ...state.selectedObject, shadow }
        : state.selectedObject,
    })),
}));
