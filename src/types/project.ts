import type { CoverPageContent } from "@/types/brochure";

export type Folder = {
  id: string;
  name: string;
};

export type EditorMode = "template" | "designer";

export type DesignerProject = {
  id: string;
  name: string;
  folderId: string | null;
  updatedAt: string;
  canvasJSON: string | null;
  coverContent: CoverPageContent;
  editorMode: EditorMode;
};

export type SelectedObjectType =
  | "text"
  | "rect"
  | "circle"
  | "line"
  | "image"
  | "group"
  | "unknown";

export type SelectedObjectMeta = {
  type: SelectedObjectType;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  fill?: string;
  stroke?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  textAlign?: string;
  text?: string;
};
