"use client";

import {
  FileStack,
  FolderOpen,
  ImageIcon,
  LayoutTemplate,
  Layers3,
  Shapes,
  SwatchBook,
  Type,
} from "lucide-react";

import { useDesignEditorStore } from "@/store";
import type { ToolPanelId } from "@/types/project";

const TOOLS: Array<{ id: ToolPanelId; label: string; icon: React.ReactNode }> = [
  { id: "design", label: "Design", icon: <LayoutTemplate className="size-4" /> },
  { id: "text", label: "Text", icon: <Type className="size-4" /> },
  { id: "uploads", label: "Uploads", icon: <ImageIcon className="size-4" aria-hidden="true" /> },
  { id: "shapes", label: "Shapes", icon: <Shapes className="size-4" /> },
  { id: "brand", label: "Brand", icon: <SwatchBook className="size-4" /> },
  { id: "layers", label: "Layers", icon: <Layers3 className="size-4" /> },
  { id: "pages", label: "Pages", icon: <FileStack className="size-4" /> },
  { id: "projects", label: "Projects", icon: <FolderOpen className="size-4" /> },
];

export function ToolRail() {
  const activePanel = useDesignEditorStore((state) => state.activePanel);
  const togglePanel = useDesignEditorStore((state) => state.togglePanel);

  return (
    <nav
      className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-rm-neutral-200 bg-rm-white py-3"
      aria-label="Design tools"
    >
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          title={tool.label}
          onClick={() => togglePanel(tool.id)}
          className={`flex w-11 flex-col items-center gap-1 rounded-sm px-1 py-2 transition-colors ${
            activePanel === tool.id
              ? "bg-rm-blue-50 text-rm-blue-600"
              : "text-rm-neutral-600 hover:bg-rm-neutral-50 hover:text-rm-neutral-900"
          }`}
        >
          {tool.icon}
          <span className="font-body text-[10px] font-semibold leading-none">
            {tool.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
