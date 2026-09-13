import type { CoverPageContent } from "./brochure";

export type ProjectTemplate = "blank" | "t501";
export type EditorMode = "template" | "designer";

export interface DesignPage {
  id: string;
  name: string;
  pageNumber: number;
  mode: EditorMode;
  canvasJson: string | null;
  templateId?: string;
  coverContent?: CoverPageContent;
  thumbnailDataUrl?: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  folderId: string;
  template: ProjectTemplate;
  pages: DesignPage[];
  selectedPageId: string;
  createdAt: string;
  updatedAt: string;
  canvasJson?: string | null;
  coverContent?: CoverPageContent;
  editorMode?: EditorMode;
}

export type ToolPanelId =
  | "design"
  | "text"
  | "uploads"
  | "shapes"
  | "brand"
  | "layers"
  | "pages"
  | "projects"
  | null;

export interface UploadGroup {
  id: string;
  name: string;
  createdAt: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  dataUrl: string;
  type: "image" | "svg";
  groupId: string | null;
  createdAt: string;
}

export type ShadowPreset = "none" | "subtle" | "medium" | "strong" | "custom";

export interface ObjectShadowMeta {
  enabled: boolean;
  color: string;
  opacity: number;
  blur: number;
  offsetX: number;
  offsetY: number;
  preset?: ShadowPreset;
}

export type SelectedObjectType =
  | "text"
  | "rect"
  | "circle"
  | "triangle"
  | "line"
  | "image"
  | "group"
  | "square"
  | "unknown";

export interface LayerItem {
  id: string;
  name: string;
  type: SelectedObjectType;
  visible: boolean;
  locked: boolean;
  index: number;
}

export interface SelectedObjectMeta {
  id?: string;
  type: SelectedObjectType;
  isMultiSelect?: boolean;
  selectionCount?: number;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  textAlign?: string;
  filename?: string;
  name?: string;
  locked?: boolean;
  visible?: boolean;
  shadow?: ObjectShadowMeta;
  groupObjectCount?: number;
}

export type SnapGuide = {
  orientation: "horizontal" | "vertical";
  position: number;
};
