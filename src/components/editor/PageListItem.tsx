import { cn } from "@/lib/cn";

type PageListItemProps = {
  number: string;
  title: string;
  isSelected?: boolean;
};

export function PageListItem({
  number,
  title,
  isSelected = false,
}: PageListItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-sm border px-2 py-2 text-left transition-colors",
        isSelected
          ? "border-rm-blue-600 bg-rm-blue-50"
          : "border-transparent bg-transparent hover:border-rm-neutral-200 hover:bg-rm-neutral-50",
      )}
      aria-current={isSelected ? "page" : undefined}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-sm border bg-rm-neutral-100",
          isSelected ? "border-rm-blue-600/30" : "border-rm-neutral-200",
        )}
        aria-hidden="true"
      >
        <div className="h-6 w-4 rounded-[1px] border border-rm-neutral-300 bg-rm-white" />
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "block font-body text-xs font-semibold leading-4",
            isSelected ? "text-rm-blue-600" : "text-rm-neutral-500",
          )}
        >
          {number}
        </span>
        <span
          className={cn(
            "block truncate font-body text-sm leading-5",
            isSelected ? "font-semibold text-rm-neutral-900" : "text-rm-neutral-700",
          )}
        >
          {title}
        </span>
      </div>
    </button>
  );
}
