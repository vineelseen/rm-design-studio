import { Field, PanelSection } from "@/components/ui";

export function PropertiesPanel() {
  return (
    <aside
      className="flex w-[300px] shrink-0 flex-col border-l border-rm-neutral-200 bg-rm-white"
    >
      <div className="border-b border-rm-neutral-200 px-4 py-3">
        <h2 className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
          Properties
        </h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <PanelSection title="Page">
          <Field label="Page type" value="Cover" />
        </PanelSection>

        <PanelSection title="Template">
          <Field label="Product name" value="T501 Gen2" />
          <Field label="Generation" value="Gen2" />
        </PanelSection>

        <PanelSection title="Content">
          <Field label="Subtitle" value="Advanced Monitoring System" />
        </PanelSection>

        <PanelSection title="Appearance" className="border-b-0 pb-0">
          <Field label="Layout" value="Standard cover" />
        </PanelSection>
      </div>
    </aside>
  );
}
