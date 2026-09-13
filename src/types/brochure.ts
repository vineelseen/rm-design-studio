export type CoverPageContent = {
  eyebrow: string;
  productName: string;
  generation: string;
  subtitle: string;
  tagline: string;
};

export type CoverBrochurePage = {
  id: string;
  type: "cover";
  title: string;
  content: CoverPageContent;
};

export type BrochureProject = {
  projectName: string;
  templateId: string;
  pages: CoverBrochurePage[];
};
