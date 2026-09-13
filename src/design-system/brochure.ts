export const brochureDocument = {
  pageWidthMm: 210,
  pageHeightMm: 297,
  pageAspectRatio: 210 / 297,
  orientation: "portrait",
} as const;

export const brochureLayout = {
  outerMarginMm: 14,
  columnCount: 12,
  columnGutterMm: 3,
} as const;

/**
 * Development-only toggle for the brochure grid overlay.
 * Set to true locally to inspect margins, columns, and gutters.
 */
export const SHOW_BROCHURE_GRID_OVERLAY = false;

export type BrochureOrientation = (typeof brochureDocument)["orientation"];

export const brochure = {
  document: brochureDocument,
  layout: brochureLayout,
  showGridOverlay: SHOW_BROCHURE_GRID_OVERLAY,
} as const;
