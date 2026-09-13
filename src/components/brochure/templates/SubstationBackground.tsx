import { colors } from "@/design-system";

const strokeColor = colors.primitive.neutral[300];

export function SubstationBackground() {
  return (
    <svg
      className="pointer-events-none h-full w-full"
      viewBox="0 0 210 150"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g opacity="0.14" stroke={strokeColor} strokeWidth="0.4" fill="none">
        {/* Transmission lines across lower field */}
        <path d="M0 24 L210 38" />
        <path d="M0 52 L165 62" />
        <path d="M24 78 L210 88" />

        {/* Towers — left and center */}
        <path d="M36 24 L36 98 M26 44 L46 44 M28 64 L44 64 M30 84 L42 84" />
        <path d="M88 38 L88 108 M80 58 L96 58 M82 78 L94 78" />
        <path d="M132 30 L132 100 M124 50 L140 50 M126 70 L138 70" />

        {/* Substation pad — lower left */}
        <rect x="12" y="108" width="64" height="32" rx="0.5" />
        <rect x="20" y="114" width="16" height="20" />
        <rect x="40" y="114" width="16" height="20" />
        <rect x="60" y="114" width="10" height="20" />
        <path d="M12 140 L76 140 L76 150 L12 150 Z" />

        {/* Bus work — center */}
        <path d="M90 112 L130 112" />
        <path d="M90 122 L118 122" />
        <rect x="108" y="104" width="22" height="28" rx="0.5" />

        {/* Ground reference grid */}
        <path d="M0 132 L150 132" strokeDasharray="2 3" />
        <path d="M48 108 L48 150" strokeDasharray="1.5 2.5" />
        <path d="M108 108 L108 150" strokeDasharray="1.5 2.5" />
      </g>
    </svg>
  );
}
