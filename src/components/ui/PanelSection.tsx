import { cn } from "@/lib/cn";

type PanelSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function PanelSection({ title, children, className }: PanelSectionProps) {
  return (
    <section className={cn("border-b border-rm-neutral-200 pb-4", className)}>
      <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
