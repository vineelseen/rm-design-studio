export const spacingPrimitives = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  30: "120px",
  36: "144px",
} as const;

export const spacingSemantic = {
  micro: {
    1: spacingPrimitives[1],
    2: spacingPrimitives[2],
  },
  component: {
    3: spacingPrimitives[3],
    4: spacingPrimitives[4],
    5: spacingPrimitives[5],
  },
  content: {
    6: spacingPrimitives[6],
    8: spacingPrimitives[8],
    10: spacingPrimitives[10],
  },
  layout: {
    12: spacingPrimitives[12],
    16: spacingPrimitives[16],
    20: spacingPrimitives[20],
    24: spacingPrimitives[24],
    30: spacingPrimitives[30],
    36: spacingPrimitives[36],
  },
} as const;

export const spacing = {
  primitive: spacingPrimitives,
  semantic: spacingSemantic,
} as const;
