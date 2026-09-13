"use client";

import { Download, Eye, Save } from "lucide-react";

import { Button } from "@/components/ui";
import { useBrochureEditorStore } from "@/store";

export function TopBar() {
  const projectName = useBrochureEditorStore((state) => state.project.projectName);

  return (
    <header
      className="relative col-span-full flex h-12 shrink-0 items-center justify-between border-b border-rm-neutral-200 bg-rm-white px-4"
    >
      <div className="flex min-w-0 items-baseline gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="font-heading text-base font-semibold leading-6 text-rm-neutral-900">
            RM Design Studio
          </span>
          <span className="font-body text-xs leading-4 text-rm-neutral-500">
            Brochure Builder
          </span>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="font-body text-sm font-semibold leading-5 text-rm-neutral-700">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost">
          <Save className="size-3.5" aria-hidden="true" />
          Save
        </Button>
        <Button variant="secondary">
          <Eye className="size-3.5" aria-hidden="true" />
          Preview
        </Button>
        <Button variant="primary">
          <Download className="size-3.5" aria-hidden="true" />
          Export
        </Button>
      </div>
    </header>
  );
}
