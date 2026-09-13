import { create } from "zustand";

import { INITIAL_BROCHURE_PROJECT } from "@/data/initial-brochure-project";
import type { BrochureProject, CoverPageContent } from "@/types/brochure";

type BrochureEditorState = {
  project: BrochureProject;
  selectedPageIndex: number;
  updateCoverContent: (updates: Partial<CoverPageContent>) => void;
  loadCoverProject: (projectName: string, content: CoverPageContent) => void;
  setCoverContent: (content: CoverPageContent) => void;
  getCoverContent: () => CoverPageContent;
};

export const useBrochureEditorStore = create<BrochureEditorState>((set, get) => ({
  project: INITIAL_BROCHURE_PROJECT,
  selectedPageIndex: 0,
  updateCoverContent: (updates) =>
    set((state) => {
      const pages = state.project.pages.map((page, index) => {
        if (index !== state.selectedPageIndex || page.type !== "cover") {
          return page;
        }

        return {
          ...page,
          content: {
            ...page.content,
            ...updates,
          },
        };
      });

      return {
        project: {
          ...state.project,
          pages,
        },
      };
    }),
  loadCoverProject: (projectName, content) =>
    set((state) => ({
      project: {
        ...state.project,
        projectName,
        pages: state.project.pages.map((page, index) =>
          index === state.selectedPageIndex && page.type === "cover"
            ? { ...page, content }
            : page,
        ),
      },
    })),
  setCoverContent: (content) =>
    set((state) => ({
      project: {
        ...state.project,
        pages: state.project.pages.map((page, index) =>
          index === state.selectedPageIndex && page.type === "cover"
            ? { ...page, content }
            : page,
        ),
      },
    })),
  getCoverContent: (): CoverPageContent => {
    const state = get();
    const page = state.project.pages[state.selectedPageIndex];
    if (!page || page.type !== "cover") {
      return INITIAL_BROCHURE_PROJECT.pages[0].content;
    }
    return page.content;
  },
}));
