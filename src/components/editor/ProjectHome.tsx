"use client";

import { FileImage, FolderPlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { useProjectStore } from "@/store";
import { CreateDesignDialog } from "./CreateDesignDialog";

export function ProjectHome() {
  const folders = useProjectStore((state) => state.folders);
  const projects = useProjectStore((state) => state.projects);
  const hydrate = useProjectStore((state) => state.hydrate);
  const createFolder = useProjectStore((state) => state.createFolder);
  const openProject = useProjectStore((state) => state.openProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const getFolderName = useProjectStore((state) => state.getFolderName);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createFolderId, setCreateFolderId] = useState<string | undefined>();
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 12);

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    createFolder(trimmed);
    setNewFolderName("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-rm-neutral-50">
      <header className="border-b border-rm-neutral-200 bg-rm-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-rm-neutral-900">
              RM Design Studio
            </h1>
            <p className="mt-0.5 font-body text-sm text-rm-neutral-600">
              Design tools for Rugged Monitoring
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
            <Plus className="size-4" />
            Create Design
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-rm-neutral-900">
              Folders
            </h2>
            <div className="flex items-center gap-2">
              <input
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="New folder name"
                className="h-8 w-44 rounded-sm border border-rm-neutral-300 px-3 font-body text-sm outline-none focus:border-rm-blue-600"
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleCreateFolder();
                }}
              />
              <Button variant="secondary" onClick={handleCreateFolder}>
                <FolderPlus className="size-3.5" />
                New Folder
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => {
              const count = projects.filter((p) => p.folderId === folder.id).length;
              return (
                <article
                  key={folder.id}
                  className="group rounded-sm border border-rm-neutral-200 bg-rm-white p-4 transition-colors hover:border-rm-blue-600"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-semibold text-rm-neutral-900">
                        {folder.name}
                      </h3>
                      <p className="mt-1 font-body text-xs text-rm-neutral-500">
                        {count} design{count === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setCreateFolderId(folder.id);
                        setShowCreateDialog(true);
                      }}
                      title={`Create design in ${folder.name}`}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-rm-neutral-900">
            Recent Designs
          </h2>

          {recentProjects.length === 0 ? (
            <div className="rounded-sm border border-dashed border-rm-neutral-300 bg-rm-white px-6 py-12 text-center">
              <p className="font-body text-sm text-rm-neutral-600">
                No designs yet. Create your first project to get started.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="size-3.5" />
                Create Design
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-sm border border-rm-neutral-200 bg-rm-white transition-colors hover:border-rm-blue-600"
                >
                  <button
                    type="button"
                    onClick={() => openProject(project.id)}
                    className="w-full text-left"
                  >
                    <div className="flex aspect-[4/3] items-center justify-center bg-rm-neutral-100">
                      <FileImage className="size-8 text-rm-neutral-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-body text-sm font-semibold text-rm-neutral-900">
                        {project.name}
                      </h3>
                      <p className="mt-1 font-body text-xs text-rm-neutral-500">
                        {getFolderName(project.folderId)}
                      </p>
                      <p className="mt-1 font-body text-xs text-rm-neutral-400">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                  <div className="flex justify-end border-t border-rm-neutral-100 px-2 py-1">
                    <Button
                      variant="ghost"
                      onClick={() => deleteProject(project.id)}
                      title="Delete design"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {showCreateDialog ? (
        <CreateDesignDialog
          defaultFolderId={createFolderId}
          onClose={() => {
            setShowCreateDialog(false);
            setCreateFolderId(undefined);
          }}
        />
      ) : null}
    </div>
  );
}
