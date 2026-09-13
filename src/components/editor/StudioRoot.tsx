"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout";
import { useProjectStore } from "@/store";
import { EditorBootstrap } from "./EditorBootstrap";
import { ProjectHome } from "./ProjectHome";

export function StudioRoot() {
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const hydrate = useProjectStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!activeProjectId) {
    return <ProjectHome />;
  }

  return (
    <>
      <EditorBootstrap />
      <AppShell />
    </>
  );
}
