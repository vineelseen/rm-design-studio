"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { useProjectStore } from "@/store";
import type { ProjectTemplate } from "@/types/project";

type CreateDesignDialogProps = {
  onClose: () => void;
  defaultFolderId?: string;
};

export function CreateDesignDialog({
  onClose,
  defaultFolderId,
}: CreateDesignDialogProps) {
  const folders = useProjectStore((state) => state.folders);
  const createProject = useProjectStore((state) => state.createProject);
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState(
    () => defaultFolderId ?? folders[0]?.id ?? "",
  );
  const [template, setTemplate] = useState<ProjectTemplate>("blank");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !folderId) return;

    createProject(trimmed, folderId, template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rm-neutral-950/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-sm border border-rm-neutral-200 bg-rm-white p-6 shadow-[0_8px_24px_rgba(23,29,40,0.12)]"
      >
        <h2 className="font-heading text-lg font-semibold text-rm-neutral-900">
          Create Design
        </h2>
        <p className="mt-1 font-body text-sm text-rm-neutral-600">
          Start a new A4 design in your selected folder.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Project name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="flex h-9 w-full rounded-sm border border-rm-neutral-300 px-3 font-body text-sm text-rm-neutral-900 outline-none focus:border-rm-blue-600"
              placeholder="T501 Product Brochure"
              autoFocus
            />
          </label>

          <label className="block space-y-1.5">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Folder
            </span>
            <select
              value={folderId}
              onChange={(event) => setFolderId(event.target.value)}
              className="flex h-9 w-full rounded-sm border border-rm-neutral-300 px-3 font-body text-sm text-rm-neutral-900"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <span className="font-body text-sm font-semibold text-rm-neutral-700">
              Template
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTemplate("blank")}
                className={`rounded-sm border px-3 py-3 text-left ${
                  template === "blank"
                    ? "border-rm-blue-600 bg-rm-blue-50"
                    : "border-rm-neutral-200 hover:border-rm-neutral-300"
                }`}
              >
                <span className="block font-body text-sm font-semibold text-rm-neutral-900">
                  Blank A4
                </span>
                <span className="mt-0.5 block font-body text-xs text-rm-neutral-500">
                  Opens Designer mode
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTemplate("t501")}
                className={`rounded-sm border px-3 py-3 text-left ${
                  template === "t501"
                    ? "border-rm-blue-600 bg-rm-blue-50"
                    : "border-rm-neutral-200 hover:border-rm-neutral-300"
                }`}
              >
                <span className="block font-body text-sm font-semibold text-rm-neutral-900">
                  T501 Product Brochure
                </span>
                <span className="mt-0.5 block font-body text-xs text-rm-neutral-500">
                  Opens Template mode
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim() || !folderId}>
            Create Design
          </Button>
        </div>
      </form>
    </div>
  );
}
