import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { createRoot } from "react-dom/client";

import { TemplatePageExport } from "@/components/editor/TemplatePageExport";
import { T501_ASSETS } from "@/components/brochure/templates/t501-assets";
import { CanvasController } from "@/lib/canvas-controller";
import { sanitizeFilename } from "@/lib/page-utils";
import type { CoverPageContent } from "@/types/brochure";
import type { DesignPage, Project } from "@/types/project";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const EXPORT_MULTIPLIER = 2.5;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

async function renderDesignerPageDataUrl(canvasJson: string | null): Promise<string> {
  const canvasElement = document.createElement("canvas");
  const controller = new CanvasController(canvasElement);
  try {
    await controller.loadFromJSON(canvasJson);
    return controller.exportHighResDataUrl(EXPORT_MULTIPLIER);
  } finally {
    controller.destroy();
  }
}

async function renderTemplatePageDataUrl(
  coverContent: CoverPageContent,
): Promise<string> {
  await Promise.all([
    preloadImage(T501_ASSETS.coverBackground),
    preloadImage(T501_ASSETS.logo),
  ]);

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<TemplatePageExport content={coverContent} />);

  await new Promise((resolve) => window.setTimeout(resolve, 150));

  const target = container.firstElementChild as HTMLElement;
  if (!target) {
    root.unmount();
    document.body.removeChild(container);
    throw new Error("Failed to render template page for export");
  }

  const dataUrl = await toPng(target, {
    width: 595 * 2,
    height: 842 * 2,
    pixelRatio: 2,
    cacheBust: true,
  });

  root.unmount();
  document.body.removeChild(container);
  return dataUrl;
}

async function renderPageDataUrl(page: DesignPage): Promise<string> {
  if (page.mode === "template" && page.templateId === "t501" && page.coverContent) {
    return renderTemplatePageDataUrl(page.coverContent);
  }
  return renderDesignerPageDataUrl(page.canvasJson);
}

export async function exportProjectToPdf(
  project: Project,
  onProgress?: (message: string) => void,
): Promise<void> {
  onProgress?.("Preparing PDF...");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let index = 0; index < project.pages.length; index += 1) {
    const page = project.pages[index];
    onProgress?.(`Rendering page ${index + 1} of ${project.pages.length}...`);

    const dataUrl = await renderPageDataUrl(page);
    if (index > 0) {
      pdf.addPage();
    }
    pdf.addImage(dataUrl, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST");
  }

  onProgress?.("Downloading PDF...");
  pdf.save(`${sanitizeFilename(project.name)}.pdf`);
}
