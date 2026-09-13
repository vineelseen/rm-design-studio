"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { ExportDialog } from "@/components/editor/ExportDialog";
import { Button } from "@/components/ui";
import { useProjectStore } from "@/store";

export function TopBar() {
  const activeProject = useProjectStore((state) => state.getActiveProject());
  const savedMessage = useProjectStore((state) => state.savedMessage);
  const closeProject = useProjectStore((state) => state.closeProject);
  const saveActiveProject = useProjectStore((state) => state.saveActiveProject);
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <>
      <header
        className="relative col-span-full flex h-12 shrink-0 items-center justify-between border-b border-rm-neutral-200 bg-rm-white px-4"
      >
        <button
          type="button"
          onClick={closeProject}
          className="flex min-w-0 items-baseline gap-3 text-left"
        >
          <div className="flex min-w-0 flex-col">
            <span className="font-heading text-base font-semibold leading-6 text-rm-neutral-900">
              RM Design Studio
            </span>
            <span className="font-body text-xs leading-4 text-rm-neutral-500">
              Design tools for Rugged Monitoring
            </span>
          </div>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
            {activeProject?.name ?? "Untitled Design"}
          </span>
          {savedMessage ? (
            <span className="mt-0.5 block font-body text-xs text-rm-neutral-500">
              {savedMessage}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={saveActiveProject}>
            <Save className="size-3.5" aria-hidden="true" />
            Save
          </Button>
          <Button variant="secondary" onClick={() => setShowExportDialog(true)}>
            Export
          </Button>
        </div>
      </header>

      {showExportDialog ? (
        <ExportDialog onClose={() => setShowExportDialog(false)} />
      ) : null}
    </>
  );
}
