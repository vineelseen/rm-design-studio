import { create } from "zustand";

import {
  createProject as createProjectRecord,
  deleteProject as deleteProjectRecord,
  loadFolders,
  loadProjects,
  saveFolders,
  saveProjects,
  upsertProject,
} from "@/lib/project-storage";
import {
  cloneDesignPage,
  createDesignPage,
  createInitialPages,
  getSelectedPage,
  migrateProjectToPages,
} from "@/lib/page-utils";
import {
  collectCurrentPageUpdates,
  loadPageIntoEditor,
} from "@/lib/page-sync";
import { useDesignEditorStore } from "@/store/design-editor-store";
import type {
  DesignPage,
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
  saveActiveProject: () => void;
  syncCurrentPageToProject: () => void;
  updatePage: (pageId: string, updates: Partial<DesignPage>) => void;
  selectPage: (pageId: string) => Promise<void>;
  addPage: () => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  duplicatePage: (pageId: string) => Promise<void>;
  setCurrentPageMode: (mode: EditorMode) => void;
  deleteProject: (id: string) => void;
  getActiveProject: () => Project | null;
  getSelectedPage: () => DesignPage | null;
  getFolderName: (folderId: string) => string;
}

function ensureSeedFolders(folders: ProjectFolder[]): ProjectFolder[] {
  if (folders.length > 0) return folders;
  saveFolders(SEED_FOLDERS);
  return SEED_FOLDERS;
}

function updateActiveProject(
  get: () => ProjectState,
  set: (partial: Partial<ProjectState>) => void,
  updater: (project: Project) => Project,
) {
  const { activeProjectId, projects } = get();
  if (!activeProjectId) return null;

  const existing = projects.find((project) => project.id === activeProjectId);
  if (!existing) return null;

  const updated = updater(existing);
  const next = projects.map((project) =>
    project.id === updated.id ? updated : project,
  );
  set({ projects: next });
  return updated;
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
    const projects = loadProjects()
      .map(migrateProjectToPages)
      .map((project) => ({
        ...project,
        folderId: project.folderId || SEED_FOLDERS[0].id,
        template: project.template ?? "blank",
      }));
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
    const pages = createInitialPages(template);
    const project = {
      ...createProjectRecord(name, folderId, template, pages),
      selectedPageId: pages[0].id,
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
    get().syncCurrentPageToProject();
    set({ activeProjectId: null, savedMessage: null });
  },

  syncCurrentPageToProject: () => {
    const page = get().getSelectedPage();
    if (!page) return;
    get().updatePage(page.id, collectCurrentPageUpdates(page));
  },

  saveActiveProject: () => {
    get().syncCurrentPageToProject();
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return;

    const existing = projects.find((project) => project.id === activeProjectId);
    if (!existing) return;

    const updated = upsertProject(existing, {
      pages: existing.pages,
      selectedPageId: existing.selectedPageId,
    });
    const next = projects.map((project) =>
      project.id === updated.id ? updated : project,
    );
    saveProjects(next);
    set({ projects: next, savedMessage: "Saved" });
    window.setTimeout(() => {
      if (get().savedMessage === "Saved") {
        set({ savedMessage: null });
      }
    }, 2000);
  },

  updatePage: (pageId, updates) => {
    updateActiveProject(get, set, (project) => ({
      ...project,
      pages: project.pages.map((page) =>
        page.id === pageId ? { ...page, ...updates } : page,
      ),
    }));
  },

  selectPage: async (pageId) => {
    const project = get().getActiveProject();
    if (!project || project.selectedPageId === pageId) return;

    get().syncCurrentPageToProject();

    updateActiveProject(get, set, (current) => ({
      ...current,
      selectedPageId: pageId,
    }));

    const nextPage = get().getSelectedPage();
    if (nextPage) {
      await loadPageIntoEditor(nextPage);
    }
  },

  addPage: async () => {
    get().syncCurrentPageToProject();
    const project = get().getActiveProject();
    if (!project) return;

    const pageNumber = project.pages.length + 1;
    const newPage = createDesignPage(pageNumber, { mode: "designer" });
    const pages = [...project.pages, newPage];

    updateActiveProject(get, set, (current) => ({
      ...current,
      pages,
      selectedPageId: newPage.id,
    }));

    await loadPageIntoEditor(newPage);
  },

  deletePage: async (pageId) => {
    const project = get().getActiveProject();
    if (!project || project.pages.length <= 1) return;

    get().syncCurrentPageToProject();

    const deleteIndex = project.pages.findIndex((page) => page.id === pageId);
    if (deleteIndex === -1) return;

    const remaining = project.pages.filter((page) => page.id !== pageId);
    const renumbered = remaining.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }));

    const wasSelected = project.selectedPageId === pageId;
    const nextSelected =
      renumbered[Math.min(deleteIndex, renumbered.length - 1)] ?? renumbered[0];

    updateActiveProject(get, set, (current) => ({
      ...current,
      pages: renumbered,
      selectedPageId: nextSelected.id,
    }));

    if (wasSelected) {
      await loadPageIntoEditor(nextSelected);
    }
  },

  duplicatePage: async (pageId) => {
    get().syncCurrentPageToProject();
    const project = get().getActiveProject();
    if (!project) return;

    const sourceIndex = project.pages.findIndex((page) => page.id === pageId);
    if (sourceIndex === -1) return;

    const source = project.pages[sourceIndex];
    const duplicate = cloneDesignPage(source, sourceIndex + 2);
    const pages = [...project.pages];
    pages.splice(sourceIndex + 1, 0, duplicate);
    const renumbered = pages.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }));

    updateActiveProject(get, set, (current) => ({
      ...current,
      pages: renumbered,
      selectedPageId: duplicate.id,
    }));

    await loadPageIntoEditor(duplicate);
  },

  setCurrentPageMode: (mode) => {
    get().syncCurrentPageToProject();
    const page = get().getSelectedPage();
    if (!page) return;

    get().updatePage(page.id, { mode });
    useDesignEditorStore.getState().setMode(mode);
  },

  deleteProject: (id) => {
    deleteProjectRecord(id);
    const projects = get().projects.filter((project) => project.id !== id);
    set({
      projects,
      activeProjectId: get().activeProjectId === id ? null : get().activeProjectId,
    });
  },

  getActiveProject: () => {
    const { activeProjectId, projects } = get();
    if (!activeProjectId) return null;
    return projects.find((project) => project.id === activeProjectId) ?? null;
  },

  getSelectedPage: () => getSelectedPage(get().getActiveProject()),

  getFolderName: (folderId) => {
    return get().folders.find((folder) => folder.id === folderId)?.name ?? "Unknown";
  },
}));
