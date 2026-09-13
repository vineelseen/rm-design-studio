import { PageListItem } from "@/components/editor/PageListItem";
import { BROCHURE_PAGES, SELECTED_PAGE_INDEX } from "@/data/brochure-pages";

export function LeftSidebar() {
  return (
    <aside
      className="flex w-[250px] shrink-0 flex-col border-r border-rm-neutral-200 bg-rm-white"
    >
      <div className="border-b border-rm-neutral-200 px-4 py-3">
        <h2 className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
          Pages
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Brochure pages">
        <ul className="space-y-1">
          {BROCHURE_PAGES.map((page, index) => (
            <li key={`${page.number}-${page.title}`}>
              <PageListItem
                number={page.number}
                title={page.title}
                isSelected={index === SELECTED_PAGE_INDEX}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
