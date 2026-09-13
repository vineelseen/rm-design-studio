"use client";

import { FolderPlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { useProjectStore } from "@/store";
import { ProjectDialog } from "./ProjectDialog";

export function ProjectManager() {
  const folders = useProjectStore((state) => state.folders);
  const projects = useProjectStore((state) => state.projects);
  const loadFromStorage = useProjectStore((state) => state.loadFromStorage);
  const createFolder = useProjectStore((state) => state.createFolder);
  const renameFolder = useProjectStore((state) => state.renameFolder);
  const openProject = useProjectStore((state) => state.openProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const moveProjectToFolder = useProjectStore((state) => state.moveProjectToFolder);

  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const rootProjects = projects.filter((project) => !project.folderId);

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      return;
    }

    createFolder(trimmed);
    setNewFolderName("");
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-rm-neutral-50">
      <header className="border-b border-rm-neutral-200 bg-rm-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-semibold text-rm-neutral-900">
              RM Design Studio
            </h1>
            <p className="font-body text-sm text-rm-neutral-600">
              Project Manager
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const name = window.prompt("Folder name");
                if (name?.trim()) {
                  createFolder(name.trim());
                }
              }}
            >
              <FolderPlus className="size-3.5" />
              New Folder
            </Button>
            <Button variant="primary" onClick={() => setShowProjectDialog(true)}>
              <Plus className="size-3.5" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6">
        <section className="rounded-sm border border-rm-neutral-200 bg-rm-white p-4">
          <h2 className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
            Create Folder
          </h2>
          <div className="mt-3 flex gap-2">
            <input
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder="Folder name"
              className="flex h-8 flex-1 rounded-sm border border-rm-neutral-300 px-3 font-body text-sm"
            />
            <Button variant="secondary" onClick={handleCreateFolder}>
              Add
            </Button>
          </div>
        </section>

        {folders.map((folder) => {
          const folderProjects = projects.filter(
            (project) => project.folderId === folder.id,
          );

          return (
            <section
              key={folder.id}
              className="rounded-sm border border-rm-neutral-200 bg-rm-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  className="font-heading text-base font-semibold text-rm-neutral-900"
                  onDoubleClick={() => {
                    const next = window.prompt("Rename folder", folder.name);
                    if (next?.trim()) {
                      renameFolder(folder.id, next.trim());
                    }
                  }}
                >
                  {folder.name}
                </button>
                <span className="font-body text-xs text-rm-neutral-500">
                  {folderProjects.length} project(s)
                </span>
              </div>

              <div className="space-y-2">
                {folderProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    folders={folders}
                    onOpen={() => openProject(project.id)}
                    onDelete={() => deleteProject(project.id)}
                    onMove={(folderId) => moveProjectToFolder(project.id, folderId)}
                  />
                ))}
                {folderProjects.length === 0 ? (
                  <p className="font-body text-sm text-rm-neutral-500">
                    No projects in this folder.
                  </p>
                ) : null}
              </div>
            </section>
          );
        })}

        <section className="rounded-sm border border-rm-neutral-200 bg-rm-white p-4">
          <h2 className="mb-3 font-heading text-base font-semibold text-rm-neutral-900">
            Projects
          </h2>
          <div className="space-y-2">
            {rootProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                folders={folders}
                onOpen={() => openProject(project.id)}
                onDelete={() => deleteProject(project.id)}
                onMove={(folderId) => moveProjectToFolder(project.id, folderId)}
              />
            ))}
            {rootProjects.length === 0 ? (
              <p className="font-body text-sm text-rm-neutral-500">
                No projects yet. Create one to start designing.
              </p>
            ) : null}
          </div>
        </section>
      </main>

      {showProjectDialog ? (
        <ProjectDialog onClose={() => setShowProjectDialog(false)} />
      ) : null}
    </div>
  );
}

function ProjectRow({
  project,
  folders,
  onOpen,
  onDelete,
  onMove,
}: {
  project: {
    id: string;
    name: string;
    updatedAt: string;
    folderId: string | null;
  };
  folders: Array<{ id: string; name: string }>;
  onOpen: () => void;
  onDelete: () => void;
  onMove: (folderId: string | null) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-rm-neutral-200 px-3 py-2">
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <div className="font-body text-sm font-semibold text-rm-neutral-900">
          {project.name}
        </div>
        <div className="font-body text-xs text-rm-neutral-500">
          Updated {new Date(project.updatedAt).toLocaleString()}
        </div>
      </button>

      <div className="flex items-center gap-2">
        <select
          value={project.folderId ?? ""}
          onChange={(event) =>
            onMove(event.target.value ? event.target.value : null)
          }
          className="h-8 rounded-sm border border-rm-neutral-300 px-2 font-body text-xs"
          aria-label={`Move ${project.name} to folder`}
        >
          <option value="">No folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <Button variant="ghost" onClick={onDelete} title="Delete project">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
