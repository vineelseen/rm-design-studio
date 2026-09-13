import { Copy, Trash2 } from "lucide-react";

import { cn } from "@/lib/cn";
import type { DesignPage } from "@/types/project";

type PageListItemProps = {
  page: DesignPage;
  isSelected?: boolean;
  canDelete?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
};

export function PageListItem({
  page,
  isSelected = false,
  canDelete = false,
  onSelect,
  onDelete,
  onDuplicate,
}: PageListItemProps) {
  const thumbnail = page.thumbnailDataUrl;

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-2 rounded-sm border p-2 transition-colors",
        isSelected
          ? "border-rm-blue-600 bg-rm-blue-50"
          : "border-rm-neutral-200 bg-rm-white hover:border-rm-neutral-300",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-current={isSelected ? "page" : undefined}
      >
        <div
          className={cn(
            "flex aspect-[210/297] w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-rm-neutral-100",
            isSelected ? "border-rm-blue-600/30" : "border-rm-neutral-200",
          )}
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- page thumbnail preview
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : page.mode === "template" && page.templateId === "t501" ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-rm-blue-50 px-1 text-center">
              <span className="font-body text-[8px] font-semibold uppercase tracking-wide text-rm-blue-600">
                T501
              </span>
            </div>
          ) : (
            <div className="h-8 w-6 rounded-[1px] border border-rm-neutral-300 bg-rm-white" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "block font-body text-xs font-semibold leading-4",
              isSelected ? "text-rm-blue-600" : "text-rm-neutral-500",
            )}
          >
            Page {page.pageNumber}
          </span>
          <span
            className={cn(
              "block truncate font-body text-sm leading-5",
              isSelected ? "font-semibold text-rm-neutral-900" : "text-rm-neutral-700",
            )}
          >
            {page.name}
          </span>
        </div>
      </button>

      <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onDuplicate ? (
          <button
            type="button"
            onClick={onDuplicate}
            className="rounded-sm p-1 text-rm-neutral-400 hover:bg-rm-neutral-100 hover:text-rm-neutral-700"
            title="Duplicate page"
          >
            <Copy className="size-3.5" />
          </button>
        ) : null}
        {canDelete && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-sm p-1 text-rm-neutral-400 hover:bg-rm-neutral-100 hover:text-rm-neutral-700"
            title="Delete page"
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
