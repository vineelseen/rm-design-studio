import { colors } from "@/design-system";

const strokeColor = colors.primitive.neutral[300];

export function SubstationBackground() {
  return (
    <svg
      className="pointer-events-none h-full w-full"
      viewBox="0 0 182 269"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g opacity="0.18" stroke={strokeColor} strokeWidth="0.35" fill="none">
        <path d="M0 48 L182 72" />
        <path d="M0 96 L140 110" />
        <path d="M20 140 L182 155" />
        <path d="M28 48 L28 118 M18 68 L38 68 M20 88 L36 88 M22 108 L34 108" />
        <path d="M72 72 L72 132 M64 92 L80 92 M66 112 L78 112" />
        <path d="M118 55 L118 125 M110 75 L126 75 M112 95 L124 95" />
        <rect x="8" y="168" width="52" height="28" rx="0.5" />
        <rect x="14" y="174" width="14" height="16" />
        <rect x="32" y="174" width="14" height="16" />
        <rect x="50" y="174" width="6" height="16" />
        <path d="M8 196 L60 196 L60 210 L8 210 Z" />
        <path d="M70 178 L110 178" />
        <path d="M70 186 L98 186" />
        <rect x="88" y="170" width="18" height="24" rx="0.5" />
        <path d="M0 228 L182 228" strokeDasharray="2 3" />
        <path d="M0 244 L120 244" strokeDasharray="2 3" />
        <path d="M30 228 L30 269" strokeDasharray="1.5 2.5" />
        <path d="M90 228 L90 269" strokeDasharray="1.5 2.5" />
      </g>
    </svg>
  );
}
