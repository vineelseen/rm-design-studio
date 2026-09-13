"use client";

import { useRef } from "react";
import {
  Circle,
  FolderOpen,
  Minus,
  Square,
  Triangle,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui";
import { handleFilesUpload } from "@/lib/upload-utils";
import { useDesignEditorStore, useProjectStore } from "@/store";
import { BROCHURE_PAGES } from "@/data/brochure-pages";
import { PageListItem } from "./PageListItem";

const BRAND_COLORS = [
  { name: "Rugged Blue", value: "#0F52BA" },
  { name: "Dark Navy", value: "#041840" },
  { name: "White", value: "#FFFFFF" },
  { name: "Primary Text", value: "#171D28" },
  { name: "Secondary Gray", value: "#515C6E" },
  { name: "Signal Green", value: "#1FA570" },
];

const BRAND_FONTS = [
  { name: "Sora", value: "Sora, sans-serif" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Orbitron", value: "Orbitron, sans-serif" },
];

export function ToolPanel() {
  const activePanel = useDesignEditorStore((state) => state.activePanel);
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const uploadedAssets = useDesignEditorStore((state) => state.uploadedAssets);
  const mode = useDesignEditorStore((state) => state.mode);
  const setMode = useDesignEditorStore((state) => state.setMode);
  const closeProject = useProjectStore((state) => state.closeProject);
  const activeProject = useProjectStore((state) => state.getActiveProject());
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activePanel) return null;

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    await handleFilesUpload(files, canvasController);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <aside
      className="flex w-[280px] shrink-0 flex-col border-r border-rm-neutral-200 bg-rm-white"
    >
      <div className="border-b border-rm-neutral-200 px-4 py-3">
        <h2 className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
          {activePanel}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activePanel === "design" ? (
          <div className="space-y-3 font-body text-sm text-rm-neutral-600">
            <p>Use the Template / Designer toggle above the canvas to switch between the approved T501 cover and the freeform Fabric editor.</p>
            <p>Current mode: <strong className="text-rm-neutral-900">{mode}</strong></p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setMode(mode === "template" ? "designer" : "template")}
            >
              Switch to {mode === "template" ? "Designer" : "Template"}
            </Button>
          </div>
        ) : null}

        {activePanel === "text" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => canvasController?.addHeading()}
                className="w-full rounded-sm border border-rm-neutral-200 px-3 py-3 text-left hover:border-rm-blue-600 hover:bg-rm-blue-50"
              >
                <span className="font-heading text-lg font-semibold text-rm-neutral-900">Add a heading</span>
              </button>
              <button
                type="button"
                onClick={() => canvasController?.addSubheading()}
                className="w-full rounded-sm border border-rm-neutral-200 px-3 py-3 text-left hover:border-rm-blue-600 hover:bg-rm-blue-50"
              >
                <span className="font-heading text-base font-semibold text-rm-neutral-900">Add a subheading</span>
              </button>
              <button
                type="button"
                onClick={() => canvasController?.addBodyText()}
                className="w-full rounded-sm border border-rm-neutral-200 px-3 py-3 text-left hover:border-rm-blue-600 hover:bg-rm-blue-50"
              >
                <span className="font-body text-sm text-rm-neutral-700">Add body text</span>
              </button>
            </div>
            <div>
              <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
                RM Typography
              </p>
              <div className="space-y-1">
                {BRAND_FONTS.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => canvasController?.addText("Text", { fontFamily: font.value, fontSize: 24 })}
                    className="flex w-full items-center justify-between rounded-sm border border-rm-neutral-200 px-3 py-2 text-left hover:bg-rm-neutral-50"
                    style={{ fontFamily: font.value }}
                  >
                    <span>{font.name}</span>
                    <span className="text-xs text-rm-neutral-500">Add</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activePanel === "uploads" ? (
          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              Upload files
            </Button>
            <div
              className="rounded-sm border border-dashed border-rm-neutral-300 bg-rm-neutral-50 px-3 py-8 text-center font-body text-sm text-rm-neutral-500"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void onUpload(e.dataTransfer.files);
              }}
            >
              Drag and drop images here
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              multiple
              className="hidden"
              onChange={(e) => void onUpload(e.target.files)}
            />
            {uploadedAssets.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {uploadedAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      if (asset.type === "svg") {
                        const svg = asset.dataUrl.startsWith("data:")
                          ? decodeURIComponent(
                              asset.dataUrl.replace(/^data:image\/svg\+xml[^,]*,/, ""),
                            )
                          : asset.dataUrl;
                        void canvasController?.addSvgFromString(svg, asset.name);
                      } else {
                        void canvasController?.addImageFromDataUrl(asset.dataUrl, asset.name);
                      }
                    }}
                    className="overflow-hidden rounded-sm border border-rm-neutral-200 hover:border-rm-blue-600"
                  >
                    {asset.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element -- session thumbnail previews use data URLs
                      <img src={asset.dataUrl} alt={asset.name} className="aspect-square w-full object-cover" />
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-rm-neutral-50 font-body text-xs text-rm-neutral-500">
                        SVG
                      </div>
                    )}
                    <div className="truncate px-2 py-1 font-body text-[10px] text-rm-neutral-600">
                      {asset.name}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {activePanel === "shapes" ? (
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Rectangle", icon: <Square className="size-5" />, action: () => canvasController?.addRectangle() },
              { label: "Square", icon: <Square className="size-5" />, action: () => canvasController?.addSquare() },
              { label: "Circle", icon: <Circle className="size-5" />, action: () => canvasController?.addCircle() },
              { label: "Triangle", icon: <Triangle className="size-5" />, action: () => canvasController?.addTriangle() },
              { label: "Line", icon: <Minus className="size-5" />, action: () => canvasController?.addLine() },
            ].map((shape) => (
              <button
                key={shape.label}
                type="button"
                onClick={shape.action}
                className="flex flex-col items-center gap-2 rounded-sm border border-rm-neutral-200 px-3 py-4 hover:border-rm-blue-600 hover:bg-rm-blue-50"
              >
                <span className="text-rm-neutral-700">{shape.icon}</span>
                <span className="font-body text-xs font-semibold text-rm-neutral-700">{shape.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {activePanel === "brand" ? (
          <div className="space-y-5">
            <div>
              <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
                Brand Colors
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => canvasController?.applyBrandColor(color.value)}
                    className="flex items-center gap-2 rounded-sm border border-rm-neutral-200 px-2 py-2 text-left hover:border-rm-blue-600"
                  >
                    <span
                      className="size-5 shrink-0 rounded-sm border border-rm-neutral-200"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="min-w-0">
                      <span className="block font-body text-xs font-semibold text-rm-neutral-900">{color.name}</span>
                      <span className="block font-body text-[10px] text-rm-neutral-500">{color.value}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
                Brand Fonts
              </p>
              <div className="space-y-1">
                {BRAND_FONTS.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => canvasController?.applyBrandFont(font.value)}
                    className="w-full rounded-sm border border-rm-neutral-200 px-3 py-2 text-left hover:bg-rm-neutral-50"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activePanel === "pages" ? (
          <ul className="space-y-1">
            {BROCHURE_PAGES.map((page, index) => (
              <li key={`${page.number}-${page.title}`}>
                <PageListItem
                  number={page.number}
                  title={page.title}
                  isSelected={index === 0}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {activePanel === "projects" ? (
          <div className="space-y-3 font-body text-sm">
            <p className="text-rm-neutral-600">
              Current project: <strong className="text-rm-neutral-900">{activeProject?.name}</strong>
            </p>
            <Button variant="secondary" className="w-full" onClick={closeProject}>
              <FolderOpen className="size-3.5" />
              Return to Home
            </Button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
