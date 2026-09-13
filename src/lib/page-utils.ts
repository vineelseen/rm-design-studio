import { INITIAL_BROCHURE_PROJECT } from "@/data/initial-brochure-project";
import type { CoverPageContent } from "@/types/brochure";
import type { DesignPage, Project, ProjectTemplate } from "@/types/project";

const DEFAULT_COVER = INITIAL_BROCHURE_PROJECT.pages[0].content;

type LegacyProject = Project & {
  canvasJSON?: string | null;
};

export function createDesignPage(
  pageNumber: number,
  overrides: Partial<DesignPage> = {},
): DesignPage {
  return {
    id: `page-${crypto.randomUUID()}`,
    name: `Page ${pageNumber}`,
    pageNumber,
    mode: "designer",
    canvasJson: null,
    ...overrides,
  };
}

export function createInitialPages(template: ProjectTemplate): DesignPage[] {
  if (template === "t501") {
    return [
      createDesignPage(1, {
        mode: "template",
        templateId: "t501",
        coverContent: DEFAULT_COVER,
      }),
    ];
  }

  return [createDesignPage(1, { mode: "designer" })];
}

export function migrateProjectToPages(project: LegacyProject): Project {
  if (project.pages?.length) {
    const selectedPageId =
      project.selectedPageId &&
      project.pages.some((page) => page.id === project.selectedPageId)
        ? project.selectedPageId
        : project.pages[0].id;

    return {
      ...project,
      pages: project.pages.map((page, index) => ({
        ...page,
        pageNumber: page.pageNumber ?? index + 1,
        name: page.name ?? `Page ${index + 1}`,
        mode: page.mode ?? "designer",
        canvasJson: page.canvasJson ?? null,
      })),
      selectedPageId,
    };
  }

  const legacyCanvasJson = project.canvasJson ?? project.canvasJSON ?? null;
  const firstPage = createDesignPage(1, {
    mode:
      project.editorMode ??
      (project.template === "t501" ? "template" : "designer"),
    canvasJson: legacyCanvasJson,
    templateId: project.template === "t501" ? "t501" : undefined,
    coverContent:
      project.coverContent ??
      (project.template === "t501" ? DEFAULT_COVER : undefined),
  });

  return {
    ...project,
    pages: [firstPage],
    selectedPageId: firstPage.id,
  };
}

export function getSelectedPage(project: Project | null): DesignPage | null {
  if (!project) return null;
  return project.pages.find((page) => page.id === project.selectedPageId) ?? project.pages[0] ?? null;
}

export function duplicatePageName(sourceName: string): string {
  const copyMatch = sourceName.match(/^(.*) Copy(?: (\d+))?$/);
  if (copyMatch) {
    const base = copyMatch[1];
    const next = copyMatch[2] ? Number(copyMatch[2]) + 1 : 2;
    return `${base} Copy ${next}`;
  }
  return `${sourceName} Copy`;
}

export function cloneDesignPage(page: DesignPage, pageNumber: number): DesignPage {
  return {
    ...page,
    id: `page-${crypto.randomUUID()}`,
    name: duplicatePageName(page.name),
    pageNumber,
    canvasJson: page.canvasJson,
    coverContent: page.coverContent
      ? { ...page.coverContent }
      : undefined,
    thumbnailDataUrl: page.thumbnailDataUrl,
  };
}

export function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "design-export";
}

export function defaultCoverContent(): CoverPageContent {
  return { ...DEFAULT_COVER };
}
