"use client";

import { useState } from "react";

import { Button } from "@/components/ui";
import { exportProjectToPdf } from "@/lib/pdf-export";
import { useProjectStore } from "@/store";

type ExportDialogProps = {
  onClose: () => void;
};

export function ExportDialog({ onClose }: ExportDialogProps) {
  const project = useProjectStore((state) => state.getActiveProject());
  const syncCurrentPageToProject = useProjectStore(
    (state) => state.syncCurrentPageToProject,
  );
  const getActiveProject = useProjectStore((state) => state.getActiveProject);

  const [status, setStatus] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!project) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setStatus("Preparing PDF...");

    try {
      syncCurrentPageToProject();
      const latestProject = getActiveProject();
      if (!latestProject) return;

      await exportProjectToPdf(latestProject, setStatus);
      onClose();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Export failed. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rm-neutral-950/40 p-4">
      <div className="w-full max-w-md rounded-sm border border-rm-neutral-200 bg-rm-white p-6 shadow-[0_8px_24px_rgba(23,29,40,0.12)]">
        <h2 className="font-heading text-lg font-semibold text-rm-neutral-900">
          Export Design
        </h2>

        <div className="mt-4 space-y-2 font-body text-sm text-rm-neutral-700">
          <p>
            <span className="font-semibold text-rm-neutral-900">Document:</span>{" "}
            {project.name}
          </p>
          <p>
            <span className="font-semibold text-rm-neutral-900">Pages:</span>{" "}
            {project.pages.length} page{project.pages.length === 1 ? "" : "s"}
          </p>
          <p>
            <span className="font-semibold text-rm-neutral-900">Size:</span>{" "}
            A4 Portrait
          </p>
        </div>

        <div className="mt-5 rounded-sm border border-rm-neutral-200 bg-rm-neutral-50 px-3 py-2">
          <p className="font-body text-sm font-semibold text-rm-neutral-900">PDF</p>
          <p className="font-body text-xs text-rm-neutral-500">
            Multi-page A4 document export
          </p>
        </div>

        {status ? (
          <p className="mt-4 font-body text-sm text-rm-neutral-600">{status}</p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => void handleExport()}
            disabled={isExporting}
          >
            {isExporting ? "Preparing PDF..." : "Export PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}
