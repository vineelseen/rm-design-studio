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
  /** @deprecated migrated to pages[] */
  canvasJson?: string | null;
  /** @deprecated migrated to pages[] */
  coverContent?: CoverPageContent;
  /** @deprecated migrated to pages[] */
  editorMode?: EditorMode;
}

export type ToolPanelId =
  | "design"
  | "text"
  | "uploads"
  | "shapes"
  | "brand"
  | "pages"
  | "projects"
  | null;

export interface UploadedAsset {
  id: string;
  name: string;
  dataUrl: string;
  type: "image" | "svg";
  createdAt: string;
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

export interface SelectedObjectMeta {
  type: SelectedObjectType;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  textAlign?: string;
  filename?: string;
}
