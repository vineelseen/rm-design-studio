import { create } from "zustand";

import { INITIAL_BROCHURE_PROJECT } from "@/data/initial-brochure-project";
import {
  createProject as createProjectRecord,
  deleteProject as deleteProjectRecord,
  loadFolders,
  loadProjects,
  saveFolders,
  saveProjects,
  upsertProject,
} from "@/lib/project-storage";
import type { CoverPageContent } from "@/types/brochure";
import type {
  EditorMode,
  Project,
  ProjectFolder,
  ProjectTemplate,
} from "@/types/project";

const SEED_FOLDERS: ProjectFolder[] = [
  { id: "folder-product", name: "Product Brochures", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "folder-solution", name: "Solution Brochures", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "folder-social", name: "Social Media", createdAt: "2026-01-01T00:00:00.000Z" },
];

const DEFAULT_COVER = INITIAL_BROCHURE_PROJECT.pages[0].content;

type SavePayload = {
  canvasJson: string | null;
  coverContent?: CoverPageContent;
  editorMode?: EditorMode;
};

interface ProjectState {
  projects: Project[];
  folders: ProjectFolder[];
  activeProjectId: string | null;
  hydrated: boolean;
  savedMessage: string | null;
  hydrate: () => void;
  createFolder: (name: string) => ProjectFolder;
  createProject: (name: string, folderId: string, template: ProjectTemplate) => Project;
  openProject: (id: string) => void;
  closeProject: () => void;
  saveActiveProject: (payload: SavePayload) => void;
  updateActiveProjectDraft: (canvasJson: string) => void;
  deleteProject: (id: string) => void;
  getActiveProject: () => Project | null;
  getFolderName: (folderId: string) => string;
}

function ensureSeedFolders(folders: ProjectFolder[]): ProjectFolder[] {
  if (folders.length > 0) return folders;
  saveFolders(SEED_FOLDERS);
  return SEED_FOLDERS;
}

function normalizeProject(raw: Project & { canvasJSON?: string | null }): Project {
  return {
    ...raw,
    canvasJson: raw.canvasJson ?? raw.canvasJSON ?? null,
    template: raw.template ?? "blank",
    folderId: raw.folderId || SEED_FOLDERS[0].id,
    coverContent: raw.coverContent ?? (raw.template === "t501" ? DEFAULT_COVER : undefined),
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  folders: [],
  activeProjectId: null,
  hydrated: false,
  savedMessage: null,

  hydrate: () => {
    if (get().hydrated) return;
    const folders = ensureSeedFolders(loadFolders());
    const projects = loadProjects().map(normalizeProject);
    set({ folders, projects, hydrated: true });
  },

  createFolder: (name) => {
    const folder: ProjectFolder = {
      id: `folder-${crypto.randomUUID()}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    const folders = [...get().folders, folder];
    saveFolders(folders);
    set({ folders });
    return folder;
  },

  createProject: (name, folderId, template) => {
    const coverContent = template === "t501" ? DEFAULT_COVER : undefined;
    const editorMode: EditorMode = template === "t501" ? "template" : "designer";
    const project = {
      ...createProjectRecord(name, folderId, template),
      coverContent,
      editorMode,
    };
    const projects = [...get().projects, project];
    saveProjects(projects);
    set({ projects, activeProjectId: project.id, savedMessage: null });
    return project;
  },

  openProject: (id) => {
    set({ activeProjectId: id, savedMessage: null });
  },

  closeProject: () => {
    set({ activeProjectId: null, savedMessage: null });
  },

  saveActiveProject: (payload) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const existing = projects.find((p) => p.id === activeProjectId);
    if (!existing) return;

    const updated = upsertProject(existing, {
      canvasJson: payload.canvasJson,
      coverContent: payload.coverContent ?? existing.coverContent,
      editorMode: payload.editorMode ?? existing.editorMode,
    });
    const next = projects.map((p) => (p.id === updated.id ? updated : p));
    saveProjects(next);
    set({ projects: next, savedMessage: "Saved" });
    window.setTimeout(() => {
      if (get().savedMessage === "Saved") {
        set({ savedMessage: null });
      }
    }, 2000);
  },

  updateActiveProjectDraft: (canvasJson) => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const existing = projects.find((p) => p.id === activeProjectId);
    if (!existing) return;

    const updated = { ...existing, canvasJson };
    const next = projects.map((p) => (p.id === updated.id ? updated : p));
    set({ projects: next });
  },

  deleteProject: (id) => {
    deleteProjectRecord(id);
    const projects = get().projects.filter((p) => p.id !== id);
    set({
      projects,
      activeProjectId: get().activeProjectId === id ? null : get().activeProjectId,
    });
  },

  getActiveProject: () => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return null;
    return projects.find((p) => p.id === activeProjectId) ?? null;
  },

  getFolderName: (folderId) => {
    return get().folders.find((f) => f.id === folderId)?.name ?? "Unknown";
  },
}));
