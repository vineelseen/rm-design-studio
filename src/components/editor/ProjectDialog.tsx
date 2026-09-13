"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { useProjectStore } from "@/store";

type ProjectDialogProps = {
  onClose: () => void;
};

export function ProjectDialog({ onClose }: ProjectDialogProps) {
  const folders = useProjectStore((state) => state.folders);
  const createProject = useProjectStore((state) => state.createProject);
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    createProject(trimmed, folderId || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rm-neutral-950/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-sm border border-rm-neutral-200 bg-rm-white p-5 shadow-[0_8px_24px_rgba(23,29,40,0.12)]"
      >
        <h2 className="font-heading text-lg font-semibold text-rm-neutral-900">
          New Project
        </h2>
        <p className="mt-1 font-body text-sm text-rm-neutral-600">
          Create a blank A4 designer canvas.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Project name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="flex h-9 w-full rounded-sm border border-rm-neutral-300 px-3 font-body text-sm text-rm-neutral-900"
              placeholder="T501 Product Brochure"
              autoFocus
            />
          </label>

          <label className="block space-y-1">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Folder
            </span>
            <select
              value={folderId}
              onChange={(event) => setFolderId(event.target.value)}
              className="flex h-9 w-full rounded-sm border border-rm-neutral-300 px-3 font-body text-sm text-rm-neutral-900"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
