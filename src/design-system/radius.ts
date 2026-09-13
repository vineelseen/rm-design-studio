export const radiusPrimitives = {
  radius0: "0px",
  radiusXS: "2px",
  radiusSM: "4px",
  radiusMD: "8px",
  radiusLG: "12px",
  radiusXL: "16px",
  radiusFull: "999px",
} as const;

export const radiusSemantic = {
  technical: radiusPrimitives.radiusXS,
  compact: radiusPrimitives.radiusSM,
  standard: radiusPrimitives.radiusMD,
  card: radiusPrimitives.radiusLG,
  largeVisual: radiusPrimitives.radiusXL,
  full: radiusPrimitives.radiusFull,
} as const;

export const radius = {
  primitive: radiusPrimitives,
  semantic: radiusSemantic,
} as const;
