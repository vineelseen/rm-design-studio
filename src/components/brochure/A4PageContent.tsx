import { cn } from "@/lib/cn";
import { brochureLayout } from "@/design-system/brochure";

const { outerMarginMm, columnCount, columnGutterMm } = brochureLayout;

type A4PageContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function A4PageContent({ children, className }: A4PageContentProps) {
  return (
    <div
      className={cn("grid h-full min-h-0", className)}
      style={{
        padding: `${outerMarginMm}mm`,
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gap: `${columnGutterMm}mm`,
      }}
    >
      {children}
    </div>
  );
}
