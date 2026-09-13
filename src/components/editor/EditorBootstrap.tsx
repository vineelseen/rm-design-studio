"use client";

import { useEffect } from "react";

import { loadPageIntoEditor } from "@/lib/page-sync";
import { getSelectedPage } from "@/lib/page-utils";
import { useProjectStore } from "@/store";

export function EditorBootstrap() {
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const getActiveProject = useProjectStore((state) => state.getActiveProject);

  useEffect(() => {
    const project = getActiveProject();
    if (!project) return;

    const page = getSelectedPage(project);
    if (page) {
      void loadPageIntoEditor(page);
    }
  }, [activeProjectId, getActiveProject]);

  return null;
}
