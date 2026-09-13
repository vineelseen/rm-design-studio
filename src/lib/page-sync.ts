import { useBrochureEditorStore } from "@/store/brochure-editor-store";
import { useDesignEditorStore } from "@/store/design-editor-store";
import type { DesignPage } from "@/types/project";

export function collectCurrentPageUpdates(
  page: DesignPage,
): Partial<DesignPage> {
  const mode = useDesignEditorStore.getState().mode;
  const canvasController = useDesignEditorStore.getState().canvasController;
  const coverContent = useBrochureEditorStore.getState().getCoverContent();

  const updates: Partial<DesignPage> = { mode };

  if (mode === "designer" && canvasController) {
    updates.canvasJson = canvasController.toJSON();
    updates.thumbnailDataUrl = canvasController.exportThumbnail();
  }

  if (page.templateId === "t501") {
    updates.coverContent = coverContent;
  }

  return updates;
}

export async function loadPageIntoEditor(page: DesignPage) {
  useDesignEditorStore.getState().setMode(page.mode);

  if (page.templateId === "t501" && page.coverContent) {
    useBrochureEditorStore.getState().setCoverContent(page.coverContent);
  }

  const canvasController = useDesignEditorStore.getState().canvasController;
  if (canvasController) {
    await canvasController.loadFromJSON(page.canvasJson);
  }
}
