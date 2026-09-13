import type { BrochureProject } from "@/types/brochure";

export const INITIAL_BROCHURE_PROJECT: BrochureProject = {
  projectName: "T501 Gen2 Product Brochure",
  templateId: "t501",
  pages: [
    {
      id: "page-01",
      type: "cover",
      title: "Cover",
      content: {
        eyebrow: "PRODUCT BROCHURE",
        productName: "T501",
        generation: "Gen2",
        subtitle: "ADVANCED MONITORING SYSTEM",
        tagline: "RUGGED | ROBUST | RELIABLE",
      },
    },
  ],
};
