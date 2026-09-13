"use client";

import { useEffect, useRef, useState } from "react";

import { IText } from "fabric";

import { A4_ASPECT_RATIO, A4_CANVAS_HEIGHT, A4_CANVAS_WIDTH } from "@/lib/canvas-constants";
import { CanvasController } from "@/lib/canvas-controller";
import { useDesignEditorStore, useProjectStore } from "@/store";
import { CanvasContextMenu } from "./CanvasContextMenu";
import { SnapGuidesOverlay } from "./SnapGuidesOverlay";

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return (
    element?.tagName === "INPUT" ||
    element?.tagName === "TEXTAREA" ||
    element?.isContentEditable
  );
}

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<CanvasController | null>(null);
  const loadedProjectRef = useRef<string | null>(null);
  const [displayScale, setDisplayScale] = useState(0.8);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(
    null,
  );

  const setCanvasController = useDesignEditorStore(
    (state) => state.setCanvasController,
  );
  const setSelectedObject = useDesignEditorStore(
    (state) => state.setSelectedObject,
  );
  const setLayers = useDesignEditorStore((state) => state.setLayers);
  const setSnapGuides = useDesignEditorStore((state) => state.setSnapGuides);
  const setHistoryState = useDesignEditorStore((state) => state.setHistoryState);
  const patchSelectedShadow = useDesignEditorStore(
    (state) => state.patchSelectedShadow,
  );
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const selectedPageId = useProjectStore(
    (state) => state.getSelectedPage()?.id,
  );

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const controller = new CanvasController(element);
    controllerRef.current = controller;
    setCanvasController(controller);
    controller.onSelectionChange(setSelectedObject);
    controller.onLayersChange(setLayers);
    controller.onGuidesChange(setSnapGuides);
    controller.onHistoryChange(setHistoryState);
    controller.onShadowChange((shadow) => {
      if (shadow) patchSelectedShadow(shadow);
    });

    const page = useProjectStore.getState().getSelectedPage();
    if (page) {
      controller.setActivePageId(page.id);
      void controller.loadFromJSON(page.canvasJson);
    }

    return () => {
      controller.destroy();
      controllerRef.current = null;
      setCanvasController(null);
      setSelectedObject(null);
      setLayers([]);
      setSnapGuides([]);
      loadedProjectRef.current = null;
    };
  }, [
    setCanvasController,
    setSelectedObject,
    setLayers,
    setSnapGuides,
    setHistoryState,
    patchSelectedShadow,
  ]);

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
    const controller = controllerRef.current;
    if (!controller || !selectedPageId) return;

    const page = useProjectStore.getState().getSelectedPage();
    if (!page || page.id !== selectedPageId) return;

    controller.setActivePageId(page.id);
    void controller.loadFromJSON(page.canvasJson);
  }, [selectedPageId]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (controller) {
      controller.setDisplayScale(displayScale);
    }
  }, [displayScale]);

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
      if (isTypingTarget(event.target)) return;

      const controller = controllerRef.current;
      if (!controller) return;

      const active = controller.canvas.getActiveObject();
      if (active instanceof IText && active.isEditing) return;

      const mod = event.ctrlKey || event.metaKey;

      if (mod && event.key.toLowerCase() === "g" && event.shiftKey) {
        event.preventDefault();
        void controller.ungroupSelected();
        return;
      }

      if (mod && event.key.toLowerCase() === "g") {
        event.preventDefault();
        void controller.groupSelected();
        return;
      }

      if (mod && event.key.toLowerCase() === "d") {
        event.preventDefault();
        void controller.duplicateSelected();
        return;
      }

      if (mod && event.key.toLowerCase() === "c") {
        event.preventDefault();
        void controller.copySelected();
        return;
      }

      if (mod && event.key.toLowerCase() === "v") {
        event.preventDefault();
        void controller.pasteClipboard();
        return;
      }

      if (mod && event.key.toLowerCase() === "x") {
        event.preventDefault();
        void controller.cutSelected();
        return;
      }

      if (mod && event.key === "]" && event.shiftKey) {
        event.preventDefault();
        controller.bringToFront();
        return;
      }

      if (mod && event.key === "]") {
        event.preventDefault();
        controller.bringForward();
        return;
      }

      if (mod && event.key === "[" && event.shiftKey) {
        event.preventDefault();
        controller.sendToBack();
        return;
      }

      if (mod && event.key === "[") {
        event.preventDefault();
        controller.sendBackward();
        return;
      }

      if (mod && event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        void controller.undo();
        return;
      }

      if (
        mod &&
        (event.key.toLowerCase() === "y" ||
          (event.key.toLowerCase() === "z" && event.shiftKey))
      ) {
        event.preventDefault();
        void controller.redo();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        controller.deleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex h-full w-full items-center justify-center"
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY });
      }}
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
          className="relative"
          style={{
            width: A4_CANVAS_WIDTH,
            height: A4_CANVAS_HEIGHT,
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
        >
          <canvas ref={canvasRef} />
          <SnapGuidesOverlay />
        </div>
      </div>

      <CanvasContextMenu
        menu={contextMenu}
        controller={canvasController}
        onClose={() => setContextMenu(null)}
      />
    </div>
  );
}
