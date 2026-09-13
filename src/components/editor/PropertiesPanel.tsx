"use client";

import { Field, InputField, PanelSection } from "@/components/ui";
import { useBrochureEditorStore, useDesignEditorStore, useProjectStore } from "@/store";
import { ObjectProperties } from "./ObjectProperties";

export function PropertiesPanel() {
  const mode = useDesignEditorStore((state) => state.mode);
  const selectedPage = useProjectStore((state) => state.getSelectedPage());
  const coverContent = useBrochureEditorStore((state) => state.getCoverContent());
  const updateCoverContent = useBrochureEditorStore(
    (state) => state.updateCoverContent,
  );

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
        {mode === "template" && selectedPage?.templateId === "t501" && coverContent ? (
          <>
            <PanelSection title="Page">
              <Field label="Page type" value="Cover" />
            </PanelSection>

            <PanelSection title="Content">
              <InputField
                label="Eyebrow"
                value={coverContent.eyebrow}
                onChange={(value) => updateCoverContent({ eyebrow: value })}
              />
              <InputField
                label="Product name"
                value={coverContent.productName}
                onChange={(value) => updateCoverContent({ productName: value })}
              />
              <InputField
                label="Generation"
                value={coverContent.generation}
                onChange={(value) => updateCoverContent({ generation: value })}
              />
              <InputField
                label="Subtitle"
                value={coverContent.subtitle}
                onChange={(value) => updateCoverContent({ subtitle: value })}
              />
              <InputField
                label="Tagline"
                value={coverContent.tagline}
                onChange={(value) => updateCoverContent({ tagline: value })}
              />
            </PanelSection>
          </>
        ) : (
          <ObjectProperties />
        )}
      </div>
    </aside>
  );
}
