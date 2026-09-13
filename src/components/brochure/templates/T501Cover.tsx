import Image from "next/image";

import { colors, typeRoles } from "@/design-system";
import { brochureLayout } from "@/design-system/brochure";
import { T501_ASSETS } from "./t501-assets";

const { outerMarginMm } = brochureLayout;

const brand = colors.semantic.brand;
const text = colors.semantic.text;

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

function BottomTagline() {
  const caption = typeRoles.uiCaption;

  return (
    <div
      className="flex items-center justify-center gap-[2cqw] py-[1.1cqw]"
      style={{ width: "66.7%" }}
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
      className="relative col-span-12 min-h-full overflow-hidden"
      style={fullBleedStyle}
    >
      {/* Approved composite cover background */}
      <Image
        src={T501_ASSETS.coverBackground}
        alt=""
        fill
        priority
        sizes="(max-width: 1920px) 50vw, 33vw"
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* Live text and logo overlay */}
      <div className="relative z-10 flex h-full min-h-full flex-col">
        <div
          style={{
            paddingTop: `${outerMarginMm}mm`,
            paddingLeft: `${outerMarginMm}mm`,
          }}
        >
          <Image
            src={T501_ASSETS.logo}
            alt="Rugged Monitoring"
            width={235}
            height={52}
            priority
            className="h-[5.5cqw] w-auto"
          />
        </div>

        <div
          className="flex flex-col gap-[1.8cqw]"
          style={{
            paddingTop: "5.5cqw",
            paddingLeft: `${outerMarginMm}mm`,
            maxWidth: "62cqw",
          }}
        >
          <ProductEyebrow />
          <ProductTitle />
          <ProductSubtitle />
        </div>

        <div className="mt-auto">
          <BottomTagline />
        </div>
      </div>
    </div>
  );
}
