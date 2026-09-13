import type { DesignerProject, Folder } from "@/types/project";

const FOLDERS_KEY = "rm-design-studio-folders";
const PROJECTS_KEY = "rm-design-studio-projects";

export function loadFolders(): Folder[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FOLDERS_KEY);
    return raw ? (JSON.parse(raw) as Folder[]) : [];
  } catch {
    return [];
  }
}

export function saveFolders(folders: Folder[]): void {
  window.localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function loadProjects(): DesignerProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as DesignerProject[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: DesignerProject[]): void {
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}
