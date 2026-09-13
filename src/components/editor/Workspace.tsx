"use client";

import { A4Page, T501Cover } from "@/components/brochure";
import { useBrochureEditorStore, useDesignEditorStore } from "@/store";
import { DesignCanvas } from "./DesignCanvas";

export function Workspace() {
  const mode = useDesignEditorStore((state) => state.mode);
  const selectedPageIndex = useBrochureEditorStore(
    (state) => state.selectedPageIndex,
  );
  const coverContent = useBrochureEditorStore(
    (state) => state.project.pages[selectedPageIndex]?.content,
  );

  return (
    <main
      className="relative min-h-0 flex-1 overflow-hidden bg-rm-neutral-100"
      aria-label="Document workspace"
    >
      {mode === "template" && coverContent ? (
        <div className="@container-size absolute inset-0 z-10 flex items-center justify-center overflow-auto p-5">
          <A4Page>
            <T501Cover content={coverContent} />
          </A4Page>
        </div>
      ) : null}

      <div
        className={mode === "designer" ? "absolute inset-0" : "invisible absolute inset-0 -z-10"}
        aria-hidden={mode !== "designer"}
      >
        <DesignCanvas />
      </div>
    </main>
  );
}
