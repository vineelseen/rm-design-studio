import { colors, typeRoles } from "@/design-system";
import { brochureLayout } from "@/design-system/brochure";
import { SubstationBackground } from "./SubstationBackground";

const { outerMarginMm } = brochureLayout;

const brand = colors.semantic.brand;
const bg = colors.semantic.background;
const text = colors.semantic.text;
const neutral = colors.primitive.neutral;

/** Blue field begins at column 9 (~66.7% of page width). */
const BLUE_COL_START = 9;
const BLUE_COL_SPAN = 4;
/** Footer and left content boundary at column 8. */
const LEFT_ZONE_COL_SPAN = 8;

const fullBleedStyle = {
  margin: `-${outerMarginMm}mm`,
  width: `calc(100% + ${outerMarginMm * 2}mm)`,
  height: `calc(100% + ${outerMarginMm * 2}mm)`,
} as const;

function ProductEyebrow() {
  const role = typeRoles.uiEyebrow;

  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: role.fontWeight,
          fontSize: "1.55cqw",
          lineHeight: "2cqw",
          letterSpacing: role.letterSpacing,
          textTransform: role.textTransform,
          color: brand.primary,
        }}
      >
        Product Brochure
      </p>
      <div
        className="mt-[0.6cqw]"
        style={{
          width: "10cqw",
          height: "0.15cqw",
          minHeight: "1px",
          backgroundColor: brand.primary,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function ProductTitle() {
  const h1 = typeRoles.headingH1;

  return (
    <div className="flex flex-nowrap items-end gap-[0.35cqw]">
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: h1.fontWeight,
          fontSize: "13.5cqw",
          lineHeight: "0.9",
          letterSpacing: "-0.02em",
          color: text.primary,
        }}
      >
        T501
      </h1>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "4.5cqw",
          lineHeight: "1",
          letterSpacing: "0.04em",
          color: brand.primary,
          marginBottom: "0.8cqw",
        }}
      >
        Gen2
      </span>
    </div>
  );
}

function ProductSubtitle() {
  const body = typeRoles.bodyLarge;

  return (
    <p
      className="whitespace-nowrap"
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: body.fontWeight,
        fontSize: "1.85cqw",
        lineHeight: "1.3",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: brand.primary,
      }}
    >
      Advanced Monitoring System
    </p>
  );
}

function TechnicalCrosshair({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke={neutral[300]}
        strokeWidth="0.6"
      />
      <path
        d="M12 2 L12 8 M12 16 L12 22 M2 12 L8 12 M16 12 L22 12"
        stroke={neutral[400]}
        strokeWidth="0.6"
      />
    </svg>
  );
}

function LogoPlaceholder() {
  return (
    <div className="flex items-center gap-[1.2cqw]" aria-label="RM logo placeholder">
      <div
        className="flex size-[4.5cqw] shrink-0 items-center justify-center"
        style={{ backgroundColor: brand.primary }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6cqw",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: text.inverse,
          }}
        >
          RM
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.35cqw",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: brand.primary,
          }}
        >
          RUGGED
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.35cqw",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: brand.primary,
          }}
        >
          MONITORING
        </span>
      </div>
    </div>
  );
}

function ProductImagePlaceholder() {
  return (
    <div
      className="relative"
      style={{ width: "48cqw" }}
      aria-label="T501 product image placeholder"
    >
      <div
        className="relative flex aspect-[5/4] w-full items-center justify-center border"
        style={{
          borderColor: neutral[300],
          backgroundColor: neutral[50],
        }}
      >
        <svg
          className="h-[88%] w-[90%]"
          viewBox="0 0 280 220"
          aria-hidden="true"
        >
          <rect
            x="40"
            y="20"
            width="200"
            height="140"
            rx="2"
            fill={neutral[100]}
            stroke={neutral[300]}
            strokeWidth="1.2"
          />
          <rect
            x="52"
            y="32"
            width="176"
            height="88"
            fill={bg.page}
            stroke={neutral[200]}
            strokeWidth="0.8"
          />
          <rect
            x="60"
            y="40"
            width="72"
            height="12"
            fill={neutral[200]}
          />
          <rect
            x="60"
            y="58"
            width="120"
            height="8"
            fill={neutral[100]}
          />
          <rect
            x="60"
            y="72"
            width="100"
            height="8"
            fill={neutral[100]}
          />
          <circle
            cx="200"
            cy="76"
            r="14"
            fill={brand.primarySubtle}
            stroke={brand.primary}
            strokeWidth="1"
          />
          <path
            d="M88 160 L192 160 L204 196 L76 196 Z"
            fill={neutral[200]}
            stroke={neutral[300]}
            strokeWidth="0.8"
          />
          <rect
            x="220"
            y="48"
            width="36"
            height="64"
            fill={neutral[100]}
            stroke={neutral[300]}
            strokeWidth="0.8"
          />
        </svg>
        <span
          className="absolute bottom-[1cqw] left-[1.2cqw]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1cqw",
            color: text.tertiary,
          }}
        >
          T501 product image placeholder
        </span>
      </div>
    </div>
  );
}

function BottomTaglineStrip() {
  const caption = typeRoles.uiCaption;

  return (
    <div
      className="flex items-center justify-center gap-[2cqw] px-[2cqw] py-[1.1cqw]"
      style={{ backgroundColor: brand.primary }}
    >
      {["Rugged", "Robust", "Reliable"].map((word, index) => (
        <span key={word} className="flex items-center gap-[2cqw]">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.6cqw",
              lineHeight: caption.lineHeight,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: text.inverse,
            }}
          >
            {word}
          </span>
          {index < 2 ? (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.4cqw",
                color: "rgba(255, 255, 255, 0.55)",
              }}
              aria-hidden="true"
            >
              |
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function T501Cover() {
  return (
    <div
      className="relative col-span-12 grid min-h-full grid-cols-12 grid-rows-[auto_1fr_auto] bg-rm-white"
      style={fullBleedStyle}
    >
      {/* Substation environment — lower half only */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[52%]">
        <SubstationBackground />
      </div>

      {/* Right blue field — full height, ~right third */}
      <div
        className="z-0 row-span-3 row-start-1"
        style={{
          gridColumn: `${BLUE_COL_START} / span ${BLUE_COL_SPAN}`,
          backgroundColor: brand.primary,
        }}
        aria-hidden="true"
      />

      {/* Subtle vertical ticks on blue field */}
      <div
        className="pointer-events-none z-0 row-span-3 row-start-1 grid grid-cols-4"
        style={{ gridColumn: `${BLUE_COL_START} / span ${BLUE_COL_SPAN}` }}
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-full border-l"
            style={{ borderColor: "rgba(255, 255, 255, 0.07)" }}
          />
        ))}
      </div>

      {/* Logo — upper left */}
      <div
        className="relative z-10 row-start-1"
        style={{
          gridColumn: "1 / 5",
          paddingTop: `${outerMarginMm}mm`,
          paddingLeft: `${outerMarginMm}mm`,
        }}
      >
        <LogoPlaceholder />
      </div>

      {/* Technical crosshair — lower left */}
      <div
        className="relative z-10 row-start-2 self-end opacity-40"
        style={{
          gridColumn: "2 / 3",
          marginBottom: "22cqw",
          marginLeft: `${outerMarginMm}mm`,
        }}
      >
        <TechnicalCrosshair />
      </div>

      {/* Main copy — left two-thirds */}
      <div
        className="relative z-10 row-start-2 flex flex-col gap-[1.8cqw] self-start"
        style={{
          gridColumn: `1 / ${LEFT_ZONE_COL_SPAN + 1}`,
          paddingTop: "6cqw",
          paddingLeft: `${outerMarginMm}mm`,
          maxWidth: "62cqw",
        }}
      >
        <ProductEyebrow />
        <ProductTitle />
        <ProductSubtitle />
      </div>

      {/* Product hero — large, lower-right, overlapping white/blue boundary */}
      <div
        className="relative z-20 row-start-2 self-end"
        style={{
          gridColumn: "5 / -1",
          justifySelf: "end",
          paddingBottom: "5.5cqw",
        }}
      >
        <ProductImagePlaceholder />
      </div>

      {/* Footer tagline — left edge to blue field boundary */}
      <div
        className="relative z-10 row-start-3"
        style={{ gridColumn: `1 / ${LEFT_ZONE_COL_SPAN + 1}` }}
      >
        <BottomTaglineStrip />
      </div>
    </div>
  );
}
