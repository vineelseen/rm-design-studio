import { PagesPanel } from "@/components/editor/PagesPanel";

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
        <PagesPanel />
      </nav>
    </aside>
  );
}
