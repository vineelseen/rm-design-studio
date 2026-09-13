import { create } from "zustand";

import {
  loadFolders,
  loadProjects,
  saveFolders,
  saveProjects,
} from "@/lib/project-storage";
import { INITIAL_BROCHURE_PROJECT } from "@/data/initial-brochure-project";
import { useBrochureEditorStore } from "@/store/brochure-editor-store";
import { useDesignEditorStore } from "@/store/design-editor-store";
import type { CoverPageContent } from "@/types/brochure";
import type { DesignerProject, EditorMode, Folder } from "@/types/project";

type ProjectStoreState = {
  folders: Folder[];
  projects: DesignerProject[];
  activeProjectId: string | null;
  view: "manager" | "editor";
  savedMessage: string | null;
  loadFromStorage: () => void;
  createFolder: (name: string) => void;
  renameFolder: (folderId: string, name: string) => void;
  createProject: (name: string, folderId: string | null) => string;
  openProject: (projectId: string) => void;
  closeProject: () => void;
  deleteProject: (projectId: string) => void;
  moveProjectToFolder: (projectId: string, folderId: string | null) => void;
  saveActiveProject: (payload: {
    canvasJSON: string | null;
    coverContent: CoverPageContent;
    editorMode: EditorMode;
  }) => void;
  updateActiveProjectDraft: (canvasJSON: string) => void;
  setSavedMessage: (message: string | null) => void;
  getActiveProject: () => DesignerProject | null;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  folders: [],
  projects: [],
  activeProjectId: null,
  view: "manager",
  savedMessage: null,

  loadFromStorage: () => {
    const projects = loadProjects().map((project) => ({
      ...project,
      coverContent:
        project.coverContent ?? INITIAL_BROCHURE_PROJECT.pages[0].content,
      editorMode: project.editorMode ?? "designer",
    }));

    set({
      folders: loadFolders(),
      projects,
    });
  },

  createFolder: (name) => {
    const folder: Folder = { id: createId(), name };
    const folders = [...get().folders, folder];
    saveFolders(folders);
    set({ folders });
  },

  renameFolder: (folderId, name) => {
    const folders = get().folders.map((folder) =>
      folder.id === folderId ? { ...folder, name } : folder,
    );
    saveFolders(folders);
    set({ folders });
  },

  createProject: (name, folderId) => {
    const project: DesignerProject = {
      id: createId(),
      name,
      folderId,
      updatedAt: new Date().toISOString(),
      canvasJSON: null,
      coverContent: INITIAL_BROCHURE_PROJECT.pages[0].content,
      editorMode: "designer",
    };

    const projects = [...get().projects, project];
    saveProjects(projects);
    useBrochureEditorStore
      .getState()
      .loadCoverProject(project.name, project.coverContent);
    useDesignEditorStore.getState().setMode("designer");
    set({ projects, activeProjectId: project.id, view: "editor" });
    return project.id;
  },

  openProject: (projectId) => {
    const project = get().projects.find((item) => item.id === projectId);
    if (project) {
      useBrochureEditorStore
        .getState()
        .loadCoverProject(project.name, project.coverContent);
      useDesignEditorStore.getState().setMode(project.editorMode);
    }

    set({ activeProjectId: projectId, view: "editor" });
  },

  closeProject: () => {
    set({ activeProjectId: null, view: "manager" });
  },

  deleteProject: (projectId) => {
    const projects = get().projects.filter((project) => project.id !== projectId);
    saveProjects(projects);
    set({
      projects,
      activeProjectId:
        get().activeProjectId === projectId ? null : get().activeProjectId,
      view: get().activeProjectId === projectId ? "manager" : get().view,
    });
  },

  moveProjectToFolder: (projectId, folderId) => {
    const projects = get().projects.map((project) =>
      project.id === projectId ? { ...project, folderId } : project,
    );
    saveProjects(projects);
    set({ projects });
  },

  saveActiveProject: ({ canvasJSON, coverContent, editorMode }) => {
    const activeProjectId = get().activeProjectId;
    if (!activeProjectId) {
      return;
    }

    const projects = get().projects.map((project) =>
      project.id === activeProjectId
        ? {
            ...project,
            canvasJSON,
            coverContent,
            editorMode,
            updatedAt: new Date().toISOString(),
          }
        : project,
    );

    saveProjects(projects);
    set({ projects, savedMessage: "Saved" });
    window.setTimeout(() => {
      set({ savedMessage: null });
    }, 2000);
  },

  updateActiveProjectDraft: (canvasJSON) => {
    const activeProjectId = get().activeProjectId;
    if (!activeProjectId) {
      return;
    }

    set({
      projects: get().projects.map((project) =>
        project.id === activeProjectId ? { ...project, canvasJSON } : project,
      ),
    });
  },

  setSavedMessage: (message) => set({ savedMessage: message }),

  getActiveProject: () => {
    const activeProjectId = get().activeProjectId;
    if (!activeProjectId) {
      return null;
    }

    return get().projects.find((project) => project.id === activeProjectId) ?? null;
  },
}));
