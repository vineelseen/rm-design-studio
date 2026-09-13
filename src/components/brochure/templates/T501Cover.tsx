import { colors, typeRoles } from "@/design-system";
import { brochureLayout } from "@/design-system/brochure";
import { SubstationBackground } from "./SubstationBackground";

const { columnGutterMm } = brochureLayout;

const brand = colors.semantic.brand;
const bg = colors.semantic.background;
const text = colors.semantic.text;
const neutral = colors.primitive.neutral;

function ProductEyebrow() {
  const role = typeRoles.uiEyebrow;

  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: role.fontWeight,
        fontSize: "1.65cqw",
        lineHeight: "2.2cqw",
        letterSpacing: role.letterSpacing,
        textTransform: role.textTransform,
        color: text.tertiary,
      }}
    >
      Product Brochure
    </p>
  );
}

function ProductTitle() {
  const h1 = typeRoles.headingH1;

  return (
    <div className="flex items-end gap-[1.5cqw]">
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: h1.fontWeight,
          fontSize: "14.5cqw",
          lineHeight: "0.92",
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
          fontSize: "4.2cqw",
          lineHeight: "1",
          letterSpacing: "0.06em",
          color: brand.primary,
          marginBottom: "1.2cqw",
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
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: body.fontWeight,
        fontSize: "2.35cqw",
        lineHeight: "1.45",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: text.secondary,
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke={neutral[300]}
        strokeWidth="0.75"
      />
      <path
        d="M12 2 L12 8 M12 16 L12 22 M2 12 L8 12 M16 12 L22 12"
        stroke={neutral[400]}
        strokeWidth="0.75"
      />
    </svg>
  );
}

function LogoPlaceholder() {
  return (
    <div className="flex flex-col gap-[0.5cqw]" aria-label="RM logo placeholder">
      <div
        className="flex h-[5.5cqw] w-[14cqw] items-center justify-center border"
        style={{
          borderColor: neutral[300],
          backgroundColor: bg.page,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4cqw",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: text.tertiary,
          }}
        >
          RM
        </span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.1cqw",
          lineHeight: "1.4",
          color: text.tertiary,
        }}
      >
        Logo placeholder
      </span>
    </div>
  );
}

function ProductImagePlaceholder() {
  return (
    <div aria-label="T501 product image placeholder">
      <div
        className="relative flex aspect-[4/3] w-full items-end justify-center border pb-[2cqw]"
        style={{
          borderColor: neutral[300],
          backgroundColor: neutral[50],
        }}
      >
        <svg
          className="h-[72%] w-[68%]"
          viewBox="0 0 200 150"
          aria-hidden="true"
        >
          <rect
            x="36"
            y="28"
            width="128"
            height="88"
            fill={neutral[100]}
            stroke={neutral[300]}
            strokeWidth="1"
          />
          <rect
            x="48"
            y="40"
            width="104"
            height="52"
            fill={bg.page}
            stroke={neutral[200]}
            strokeWidth="0.75"
          />
          <path
            d="M72 92 L128 92 L136 108 L64 108 Z"
            fill={neutral[200]}
            stroke={neutral[300]}
            strokeWidth="0.75"
          />
          <circle
            cx="100"
            cy="66"
            r="10"
            fill={brand.primarySubtle}
            stroke={brand.primary}
            strokeWidth="1"
          />
          <path
            d="M148 52 L168 42 L168 82 L148 72 Z"
            fill={neutral[100]}
            stroke={neutral[300]}
            strokeWidth="0.75"
          />
        </svg>
        <span
          className="absolute bottom-[1.2cqw] left-[1.5cqw]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.2cqw",
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
      className="flex items-center justify-center gap-[2.5cqw] px-[2cqw] py-[1.4cqw]"
      style={{ backgroundColor: bg.dark }}
    >
      {["Rugged", "Robust", "Reliable"].map((word, index) => (
        <span key={word} className="flex items-center gap-[2.5cqw]">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.75cqw",
              lineHeight: caption.lineHeight,
              letterSpacing: "0.18em",
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
                fontSize: "1.5cqw",
                color: neutral[500],
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
      className="relative col-span-12 grid h-full min-h-0 grid-cols-12 grid-rows-[auto_1fr_auto]"
      style={{ gap: `${columnGutterMm}mm` }}
    >
      {/* Background layers — stacked in grid rows 1–3 */}
      <div className="pointer-events-none z-0 col-span-12 row-span-3 row-start-1">
        <SubstationBackground />
      </div>

      <div
        className="z-0 col-span-5 col-start-8 row-span-3 row-start-1"
        style={{ backgroundColor: brand.primary }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none z-0 col-span-5 col-start-8 row-span-3 row-start-1 grid grid-cols-5"
        style={{ gap: `${columnGutterMm}mm` }}
        aria-hidden="true"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-full border-l"
            style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 col-span-3 col-start-1 row-start-1">
        <LogoPlaceholder />
      </div>
      <TechnicalCrosshair className="relative z-10 col-span-1 col-start-7 row-start-1 justify-self-end opacity-60" />
      <TechnicalCrosshair className="relative z-10 col-span-1 col-start-12 row-start-1 justify-self-end opacity-40" />

      {/* Main copy */}
      <div
        className="relative z-10 col-span-7 col-start-1 row-start-2 flex flex-col gap-[2.5cqw] self-start pt-[4cqw]"
      >
        <ProductEyebrow />
        <ProductTitle />
        <ProductSubtitle />
      </div>

      {/* Product hero */}
      <div className="relative z-10 col-span-7 col-start-5 row-start-2 self-end">
        <ProductImagePlaceholder />
      </div>

      {/* Footer */}
      <div className="relative z-10 col-span-12 col-start-1 row-start-3 self-end">
        <BottomTaglineStrip />
      </div>
    </div>
  );
}
