import type { Project, ProjectFolder, ProjectTemplate } from '@/types/project';

const PROJECTS_KEY = 'rm-design-studio:projects';
const FOLDERS_KEY = 'rm-design-studio:folders';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadProjects(): Project[] {
  return readJson<Project[]>(PROJECTS_KEY, []);
}

export function saveProjects(projects: Project[]): void {
  writeJson(PROJECTS_KEY, projects);
}

export function loadFolders(): ProjectFolder[] {
  return readJson<ProjectFolder[]>(FOLDERS_KEY, []);
}

export function saveFolders(folders: ProjectFolder[]): void {
  writeJson(FOLDERS_KEY, folders);
}

export function createProject(
  name: string,
  folderId: string,
  template: ProjectTemplate = 'blank',
): Project {
  const now = new Date().toISOString();
  return {
    id: `project-${crypto.randomUUID()}`,
    name: name.trim() || 'Untitled Design',
    folderId,
    template,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertProject(project: Project, updates: Partial<Project>): Project {
  const updated: Project = {
    ...project,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return updated;
}

export function deleteProject(id: string): void {
  const projects = loadProjects().filter((p) => p.id !== id);
  saveProjects(projects);
}
