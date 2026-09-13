"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui";
import { useProjectStore } from "@/store";
import type { DesignPage } from "@/types/project";
import { PageListItem } from "./PageListItem";

export function PagesPanel() {
  const project = useProjectStore((state) => state.getActiveProject());
  const selectedPage = useProjectStore((state) => state.getSelectedPage());
  const addPage = useProjectStore((state) => state.addPage);
  const selectPage = useProjectStore((state) => state.selectPage);
  const deletePage = useProjectStore((state) => state.deletePage);
  const duplicatePage = useProjectStore((state) => state.duplicatePage);

  const [pendingDelete, setPendingDelete] = useState<DesignPage | null>(null);

  if (!project) return null;

  const canDelete = project.pages.length > 1;

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {project.pages.map((page) => (
          <li key={page.id}>
            <PageListItem
              page={page}
              isSelected={selectedPage?.id === page.id}
              canDelete={canDelete}
              onSelect={() => void selectPage(page.id)}
              onDelete={() => setPendingDelete(page)}
              onDuplicate={() => void duplicatePage(page.id)}
            />
          </li>
        ))}
      </ul>

      <Button variant="secondary" className="w-full" onClick={() => void addPage()}>
        <Plus className="size-3.5" />
        Add Page
      </Button>

      {pendingDelete ? (
        <div className="rounded-sm border border-rm-neutral-200 bg-rm-neutral-50 p-3">
          <p className="font-body text-sm text-rm-neutral-700">
            Delete this page?
          </p>
          <p className="mt-1 font-body text-xs text-rm-neutral-500">
            {pendingDelete.name}
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                void deletePage(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
