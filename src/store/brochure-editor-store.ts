import { create } from "zustand";

import { INITIAL_BROCHURE_PROJECT } from "@/data/initial-brochure-project";
import type { BrochureProject, CoverPageContent } from "@/types/brochure";

type BrochureEditorState = {
  project: BrochureProject;
  selectedPageIndex: number;
  updateCoverContent: (updates: Partial<CoverPageContent>) => void;
};

export const useBrochureEditorStore = create<BrochureEditorState>((set) => ({
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
}));
