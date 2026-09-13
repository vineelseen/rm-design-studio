import { brochureLayout } from "@/design-system/brochure";

const { outerMarginMm, columnCount, columnGutterMm } = brochureLayout;

export function BrochureGridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    >
      {/* Margin bands */}
      <div
        className="absolute inset-x-0 top-0 bg-rm-blue-600/5"
        style={{ height: `${outerMarginMm}mm` }}
      />
      <div
        className="absolute inset-x-0 bottom-0 bg-rm-blue-600/5"
        style={{ height: `${outerMarginMm}mm` }}
      />
      <div
        className="absolute inset-y-0 left-0 bg-rm-blue-600/5"
        style={{ width: `${outerMarginMm}mm` }}
      />
      <div
        className="absolute inset-y-0 right-0 bg-rm-blue-600/5"
        style={{ width: `${outerMarginMm}mm` }}
      />

      {/* Content area boundary */}
      <div
        className="absolute border border-dashed border-rm-blue-600/25"
        style={{
          top: `${outerMarginMm}mm`,
          right: `${outerMarginMm}mm`,
          bottom: `${outerMarginMm}mm`,
          left: `${outerMarginMm}mm`,
        }}
      >
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            gap: `${columnGutterMm}mm`,
          }}
        >
          {Array.from({ length: columnCount }, (_, index) => (
            <div
              key={index}
              className="h-full border border-rm-blue-600/15 bg-rm-blue-600/[0.03]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
