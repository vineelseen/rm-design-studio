"use client";

import { useEffect, useRef, useState } from "react";

import { A4_ASPECT_RATIO, A4_CANVAS_HEIGHT, A4_CANVAS_WIDTH } from "@/lib/canvas-constants";
import { CanvasController } from "@/lib/canvas-controller";
import { useDesignEditorStore, useProjectStore } from "@/store";

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<CanvasController | null>(null);
  const loadedProjectRef = useRef<string | null>(null);
  const [displayScale, setDisplayScale] = useState(0.8);

  const setCanvasController = useDesignEditorStore(
    (state) => state.setCanvasController,
  );
  const setSelectedObject = useDesignEditorStore(
    (state) => state.setSelectedObject,
  );
  const activeProjectId = useProjectStore((state) => state.activeProjectId);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const controller = new CanvasController(element);
    controllerRef.current = controller;
    setCanvasController(controller);
    controller.onSelectionChange(setSelectedObject);

    const page = useProjectStore.getState().getSelectedPage();
    if (page) {
      void controller.loadFromJSON(page.canvasJson);
    }

    return () => {
      controller.destroy();
      controllerRef.current = null;
      setCanvasController(null);
      setSelectedObject(null);
      loadedProjectRef.current = null;
    };
  }, [setCanvasController, setSelectedObject]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller || !activeProjectId) return;
    if (loadedProjectRef.current === activeProjectId) return;

    const page = useProjectStore.getState().getSelectedPage();
    if (!page) return;

    loadedProjectRef.current = activeProjectId;
    void controller.loadFromJSON(page.canvasJson);
  }, [activeProjectId]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScale = () => {
      const availableWidth = wrapper.clientWidth - 32;
      const availableHeight = wrapper.clientHeight - 32;
      const widthScale = availableWidth / A4_CANVAS_WIDTH;
      const heightScale = availableHeight / A4_CANVAS_HEIGHT;
      setDisplayScale(Math.min(widthScale, heightScale, 1));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        controllerRef.current?.deleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        className="relative bg-rm-white shadow-[0_1px_3px_rgba(23,29,40,0.06),0_0_1px_rgba(23,29,40,0.08)]"
        style={{
          width: A4_CANVAS_WIDTH * displayScale,
          height: A4_CANVAS_HEIGHT * displayScale,
          aspectRatio: String(A4_ASPECT_RATIO),
        }}
      >
        <div
          style={{
            width: A4_CANVAS_WIDTH,
            height: A4_CANVAS_HEIGHT,
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
