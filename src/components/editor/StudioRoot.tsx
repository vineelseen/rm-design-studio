"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout";
import { useProjectStore } from "@/store";
import { ProjectManager } from "./ProjectManager";

export function StudioRoot() {
  const view = useProjectStore((state) => state.view);
  const loadFromStorage = useProjectStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (view === "manager") {
    return <ProjectManager />;
  }

  return <AppShell />;
}
