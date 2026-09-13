"use client";

import { A4Page, T501Cover } from "@/components/brochure";
import { useDesignEditorStore, useProjectStore } from "@/store";
import { DesignCanvas } from "./DesignCanvas";

export function Workspace() {
  const mode = useDesignEditorStore((state) => state.mode);
  const selectedPage = useProjectStore((state) => state.getSelectedPage());
  const coverContent = selectedPage?.coverContent;

  const showTemplate =
    mode === "template" &&
    selectedPage?.templateId === "t501" &&
    coverContent;

  return (
    <main
      className="relative min-h-0 flex-1 overflow-hidden bg-rm-neutral-100"
      aria-label="Document workspace"
    >
      {showTemplate ? (
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
