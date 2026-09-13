export const fontFamilies = {
  display: "Orbitron",
  heading: "Sora",
  body: "Inter",
  ui: "Inter",
} as const;

export const fontWeights = {
  regular: 400,
  semibold: 600,
} as const;

export const typeRoles = {
  displayHero: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.semibold,
    fontSize: "72px",
    lineHeight: "76px",
  },
  headingH1: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "56px",
    lineHeight: "62px",
  },
  headingH2: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "48px",
    lineHeight: "55px",
  },
  headingH3: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "36px",
    lineHeight: "43px",
  },
  headingH4: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "28px",
    lineHeight: "35px",
  },
  headingH5: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "22px",
    lineHeight: "29px",
  },
  headingH6: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "18px",
    lineHeight: "24px",
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: "20px",
    lineHeight: "32px",
  },
  bodyDefault: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: "16px",
    lineHeight: "26px",
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: "14px",
    lineHeight: "22px",
  },
  uiEyebrow: {
    fontFamily: fontFamilies.ui,
    fontWeight: fontWeights.semibold,
    fontSize: "12px",
    lineHeight: "16px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  uiButton: {
    fontFamily: fontFamilies.ui,
    fontWeight: fontWeights.semibold,
    fontSize: "14px",
    lineHeight: "20px",
  },
  uiLabel: {
    fontFamily: fontFamilies.ui,
    fontWeight: fontWeights.semibold,
    fontSize: "14px",
    lineHeight: "20px",
  },
  uiCaption: {
    fontFamily: fontFamilies.ui,
    fontWeight: fontWeights.regular,
    fontSize: "12px",
    lineHeight: "18px",
  },
} as const;

export const typography = {
  fontFamilies,
  fontWeights,
  typeRoles,
} as const;
