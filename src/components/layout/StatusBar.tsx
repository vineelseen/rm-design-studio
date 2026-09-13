import { BROCHURE_PAGES, SELECTED_PAGE_INDEX } from "@/data/brochure-pages";

export function StatusBar() {
  const currentPage = SELECTED_PAGE_INDEX + 1;
  const totalPages = BROCHURE_PAGES.length;

  return (
    <footer
      className="col-span-full flex h-8 shrink-0 items-center justify-between border-t border-rm-neutral-200 bg-rm-white px-4"
    >
      <span className="font-body text-xs leading-[18px] text-rm-neutral-600">
        100%
      </span>

      <div className="flex items-center gap-6">
        <span className="font-body text-xs leading-[18px] text-rm-neutral-600">
          Page {currentPage} of {totalPages}
        </span>
        <span className="font-body text-xs leading-[18px] text-rm-neutral-600">
          A4 Portrait
        </span>
        <span className="font-body text-xs leading-[18px] text-rm-neutral-500">
          210 × 297 mm
        </span>
      </div>

      <span className="invisible font-body text-xs leading-[18px]" aria-hidden="true">
        100%
      </span>
    </footer>
  );
}
