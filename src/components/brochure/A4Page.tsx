import { cn } from "@/lib/cn";
import {
  brochureDocument,
  SHOW_BROCHURE_GRID_OVERLAY,
} from "@/design-system/brochure";
import { A4PageContent } from "./A4PageContent";
import { BrochureGridOverlay } from "./BrochureGridOverlay";

type A4PageProps = {
  children?: React.ReactNode;
  showGridOverlay?: boolean;
  className?: string;
};

function A4PagePlaceholder() {
  return (
    <div className="col-span-12 flex min-h-full flex-col items-center justify-center text-center">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
        Product Brochure
      </p>
      <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-rm-neutral-900">
        T501 Gen2
      </h1>
      <p className="mt-3 font-body text-lg leading-8 text-rm-neutral-600">
        Advanced Monitoring System
      </p>
    </div>
  );
}

export function A4Page({
  children,
  showGridOverlay = SHOW_BROCHURE_GRID_OVERLAY,
  className,
}: A4PageProps) {
  const { pageAspectRatio, pageWidthMm, pageHeightMm, orientation } =
    brochureDocument;

  return (
    <article
      className={cn(
        "relative @container/a4 shrink-0 bg-rm-white",
        "shadow-[0_1px_3px_rgba(23,29,40,0.06),0_0_1px_rgba(23,29,40,0.08)]",
        className,
      )}
      style={{
        aspectRatio: String(pageAspectRatio),
        width: `min(100cqw, calc(100cqh * ${pageAspectRatio}))`,
        maxHeight: "100cqh",
      }}
      aria-label={`A4 ${orientation} document, ${pageWidthMm} by ${pageHeightMm} millimeters`}
    >
      {showGridOverlay ? <BrochureGridOverlay /> : null}

      <A4PageContent>
        {children ?? <A4PagePlaceholder />}
      </A4PageContent>
    </article>
  );
}
