"use client";

import { A4Page, T501Cover } from "@/components/brochure";
import { useBrochureEditorStore } from "@/store";

export function Workspace() {
  const selectedPageIndex = useBrochureEditorStore(
    (state) => state.selectedPageIndex,
  );
  const coverContent = useBrochureEditorStore(
    (state) => state.project.pages[selectedPageIndex]?.content,
  );

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
