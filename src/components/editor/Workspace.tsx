"use client";

import { A4Page, T501Cover } from "@/components/brochure";
import { useBrochureEditorStore, useDesignEditorStore } from "@/store";
import { DesignCanvas } from "./DesignCanvas";
import { EditorToolbar } from "./EditorToolbar";

export function Workspace() {
  const mode = useDesignEditorStore((state) => state.mode);
  const selectedPageIndex = useBrochureEditorStore(
    (state) => state.selectedPageIndex,
  );
  const coverContent = useBrochureEditorStore(
    (state) => state.project.pages[selectedPageIndex]?.content,
  );

  if (mode === "template") {
    if (!coverContent) {
      return null;
    }

    return (
      <main
        className="@container-size flex h-full min-h-0 w-full items-center justify-center overflow-auto bg-rm-neutral-100 p-5"
        aria-label="Document workspace"
      >
        <A4Page>
          <T501Cover content={coverContent} />
        </A4Page>
      </main>
    );
  }

  return (
    <main
      className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-rm-neutral-100"
      aria-label="Document workspace"
    >
      <EditorToolbar />
      <div className="min-h-0 flex-1">
        <DesignCanvas />
      </div>
    </main>
  );
}
