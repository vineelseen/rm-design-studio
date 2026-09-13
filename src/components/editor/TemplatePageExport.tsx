import { colors, typeRoles } from "@/design-system";
import type { CoverPageContent } from "@/types/brochure";
import { T501_ASSETS } from "@/components/brochure/templates/t501-assets";

const brand = colors.semantic.brand;
const text = colors.semantic.text;

type TemplatePageExportProps = {
  content: CoverPageContent;
};

export function TemplatePageExport({ content }: TemplatePageExportProps) {
  const eyebrow = typeRoles.uiEyebrow;
  const h1 = typeRoles.headingH1;
  const body = typeRoles.bodyLarge;
  const caption = typeRoles.uiCaption;
  const taglineParts = content.tagline
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        width: 595,
        height: 842,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- export-only static renderer */}
      <img
        src={T501_ASSETS.coverBackground}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ paddingTop: 40, paddingLeft: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- export-only static renderer */}
          <img
            src={T501_ASSETS.logo}
            alt="Rugged Monitoring"
            style={{ height: 46, width: "auto" }}
          />
        </div>

        <div style={{ paddingTop: 46, paddingLeft: 40, maxWidth: 360 }}>
          <p
            style={{
              fontWeight: eyebrow.fontWeight,
              fontSize: 9,
              letterSpacing: eyebrow.letterSpacing,
              textTransform: "uppercase",
              color: brand.primary,
              margin: 0,
            }}
          >
            {content.eyebrow}
          </p>
          <div
            style={{
              width: 60,
              height: 1,
              backgroundColor: brand.primary,
              marginTop: 4,
            }}
          />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 18 }}>
            <h1
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: h1.fontWeight,
                fontSize: 80,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: text.primary,
                margin: 0,
              }}
            >
              {content.productName}
            </h1>
            <span
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontWeight: 600,
                fontSize: 27,
                letterSpacing: "0.04em",
                color: brand.primary,
                marginBottom: 8,
              }}
            >
              {content.generation}
            </span>
          </div>
          <p
            style={{
              fontWeight: body.fontWeight,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: brand.primary,
              marginTop: 14,
            }}
          >
            {content.subtitle}
          </p>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            paddingBottom: 28,
            width: "66.7%",
            marginInline: "auto",
          }}
        >
          {taglineParts.map((part, index) => (
            <span key={`${part}-${index}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  lineHeight: caption.lineHeight,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: text.inverse,
                }}
              >
                {part}
              </span>
              {index < taglineParts.length - 1 ? (
                <span style={{ color: "rgba(255, 255, 255, 0.55)" }}>|</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
