"use client";

import { Download, Eye, Save } from "lucide-react";

import { Button } from "@/components/ui";
import {
  useBrochureEditorStore,
  useDesignEditorStore,
  useProjectStore,
} from "@/store";

export function TopBar() {
  const activeProject = useProjectStore((state) => state.getActiveProject());
  const savedMessage = useProjectStore((state) => state.savedMessage);
  const closeProject = useProjectStore((state) => state.closeProject);
  const saveActiveProject = useProjectStore((state) => state.saveActiveProject);
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const editorMode = useDesignEditorStore((state) => state.mode);
  const getCoverContent = useBrochureEditorStore((state) => state.getCoverContent);

  const handleSave = () => {
    saveActiveProject({
      canvasJSON: canvasController?.toJSON() ?? activeProject?.canvasJSON ?? null,
      coverContent: getCoverContent(),
      editorMode,
    });
  };

  return (
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
            Brochure Builder
          </span>
        </div>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
          {activeProject?.name ?? "Untitled Brochure"}
        </span>
        {savedMessage ? (
          <span className="mt-0.5 block font-body text-xs text-rm-neutral-500">
            {savedMessage}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleSave}>
          <Save className="size-3.5" aria-hidden="true" />
          Save
        </Button>
        <Button variant="secondary" disabled title="Coming soon">
          <Eye className="size-3.5" aria-hidden="true" />
          Preview
        </Button>
        <Button variant="primary" disabled title="Coming soon">
          <Download className="size-3.5" aria-hidden="true" />
          Export
        </Button>
      </div>
    </header>
  );
}
