import { create } from "zustand";

import type { CanvasController } from "@/lib/canvas-controller";
import type {
  EditorMode,
  SelectedObjectMeta,
  ToolPanelId,
  UploadedAsset,
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
  uploadedAssets: UploadedAsset[];
  setMode: (mode: EditorMode) => void;
  setActiveTool: (tool: EditorTool) => void;
  setActivePanel: (panel: ToolPanelId | null) => void;
  togglePanel: (panel: ToolPanelId) => void;
  setCanvasController: (controller: CanvasController | null) => void;
  setSelectedObject: (meta: SelectedObjectMeta | null) => void;
  addUploadedAsset: (asset: UploadedAsset) => void;
};

function createAssetId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useDesignEditorStore = create<DesignEditorState>((set, get) => ({
  mode: "designer",
  activeTool: "select",
  activePanel: "design",
  canvasController: null,
  selectedObject: null,
  uploadedAssets: [],
  setMode: (mode) => set({ mode }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  togglePanel: (panel) =>
    set({ activePanel: get().activePanel === panel ? null : panel }),
  setCanvasController: (controller) => set({ canvasController: controller }),
  setSelectedObject: (meta) => set({ selectedObject: meta }),
  addUploadedAsset: (asset) =>
    set({ uploadedAssets: [...get().uploadedAssets, asset] }),
}));

export function createUploadedAsset(
  name: string,
  dataUrl: string,
  type: "image" | "svg",
): UploadedAsset {
  return {
    id: createAssetId(),
    name,
    dataUrl,
    type,
    createdAt: new Date().toISOString(),
  };
}
