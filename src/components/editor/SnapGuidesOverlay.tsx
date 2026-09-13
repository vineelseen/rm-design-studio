"use client";

import { A4_CANVAS_HEIGHT, A4_CANVAS_WIDTH } from "@/lib/canvas-constants";
import { useDesignEditorStore } from "@/store";

export function SnapGuidesOverlay() {
  const snapGuides = useDesignEditorStore((state) => state.snapGuides);

  if (snapGuides.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {snapGuides.map((guide, index) =>
        guide.orientation === "vertical" ? (
          <div
            key={`v-${guide.position}-${index}`}
            className="absolute top-0 bg-rm-blue-600"
            style={{
              left: guide.position,
              width: 1,
              height: A4_CANVAS_HEIGHT,
            }}
          />
        ) : (
          <div
            key={`h-${guide.position}-${index}`}
            className="absolute left-0 bg-rm-blue-600"
            style={{
              top: guide.position,
              width: A4_CANVAS_WIDTH,
              height: 1,
            }}
          />
        ),
      )}
    </div>
  );
}
