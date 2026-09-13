"use client";

import { useEffect } from "react";

import { INITIAL_BROCHURE_PROJECT } from "@/data/initial-brochure-project";
import { useBrochureEditorStore, useDesignEditorStore, useProjectStore } from "@/store";

export function EditorBootstrap() {
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const getActiveProject = useProjectStore((state) => state.getActiveProject);
  const setMode = useDesignEditorStore((state) => state.setMode);
  const loadCoverProject = useBrochureEditorStore((state) => state.loadCoverProject);

  useEffect(() => {
    const project = getActiveProject();
    if (!project) return;

    const defaultMode = project.template === "t501" ? "template" : "designer";
    setMode(project.editorMode ?? defaultMode);

    if (project.template === "t501") {
      loadCoverProject(
        project.name,
        project.coverContent ?? INITIAL_BROCHURE_PROJECT.pages[0].content,
      );
    }
  }, [activeProjectId, getActiveProject, setMode, loadCoverProject]);

  return null;
}
