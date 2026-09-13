"use client";

import { useEffect, useRef } from "react";

import type { CanvasController } from "@/lib/canvas-controller";

type MenuState = {
  x: number;
  y: number;
} | null;

type CanvasContextMenuProps = {
  menu: MenuState;
  controller: CanvasController | null;
  onClose: () => void;
};

export function CanvasContextMenu({
  menu,
  controller,
  onClose,
}: CanvasContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!menu || !controller) return null;

  const canGroup = controller.canGroup();
  const canUngroup = controller.canUngroup();
  const canDistribute = controller.canDistribute();
  const isLocked = controller.isSelectionLocked();

  const itemClass =
    "block w-full px-3 py-1.5 text-left font-body text-sm text-rm-neutral-800 hover:bg-rm-neutral-50 disabled:cursor-not-allowed disabled:text-rm-neutral-400";

  const run = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[220px] rounded-sm border border-rm-neutral-200 bg-rm-white py-1 shadow-[0_8px_24px_rgba(23,29,40,0.12)]"
      style={{ left: menu.x, top: menu.y }}
    >
      <button type="button" className={itemClass} onClick={() => run(() => void controller.cutSelected())}>
        Cut
      </button>
      <button type="button" className={itemClass} onClick={() => run(() => void controller.copySelected())}>
        Copy
      </button>
      <button type="button" className={itemClass} onClick={() => run(() => void controller.pasteClipboard())}>
        Paste
      </button>
      <button type="button" className={itemClass} onClick={() => run(() => void controller.duplicateSelected())}>
        Duplicate
      </button>

      <div className="my-1 border-t border-rm-neutral-200" />

      <button
        type="button"
        className={itemClass}
        disabled={!canGroup}
        onClick={() => run(() => void controller.groupSelected())}
      >
        Group
      </button>
      <button
        type="button"
        className={itemClass}
        disabled={!canUngroup}
        onClick={() => run(() => void controller.ungroupSelected())}
      >
        Ungroup
      </button>

      <div className="my-1 border-t border-rm-neutral-200" />

      <button
        type="button"
        className={itemClass}
        onClick={() =>
          run(() =>
            isLocked ? controller.unlockSelected() : controller.lockSelected(),
          )
        }
      >
        {isLocked ? "Unlock" : "Lock"}
      </button>

      <div className="my-1 border-t border-rm-neutral-200" />
      <div className="px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-rm-neutral-500">
        Align
      </div>
      {(
        [
          ["Align Left", () => controller.alignSelection("left")],
          ["Align Center", () => controller.alignSelection("center")],
          ["Align Right", () => controller.alignSelection("right")],
          ["Align Top", () => controller.alignSelection("top")],
          ["Align Middle", () => controller.alignSelection("middle")],
          ["Align Bottom", () => controller.alignSelection("bottom")],
        ] as Array<[string, () => void]>
      ).map(([label, action]) => (
        <button
          key={label}
          type="button"
          className={itemClass}
          onClick={() => run(action)}
        >
          {label}
        </button>
      ))}

      <div className="my-1 border-t border-rm-neutral-200" />
      <div className="px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-rm-neutral-500">
        Align to Page
      </div>
      {(
        [
          ["Center Horizontally", () => controller.alignSelectionToPage("page-center-h")],
          ["Center Vertically", () => controller.alignSelectionToPage("page-center-v")],
          ["Align Left", () => controller.alignSelectionToPage("page-left")],
          ["Align Right", () => controller.alignSelectionToPage("page-right")],
          ["Align Top", () => controller.alignSelectionToPage("page-top")],
          ["Align Bottom", () => controller.alignSelectionToPage("page-bottom")],
        ] as Array<[string, () => void]>
      ).map(([label, action]) => (
        <button
          key={label}
          type="button"
          className={itemClass}
          onClick={() => run(action)}
        >
          {label}
        </button>
      ))}

      <div className="my-1 border-t border-rm-neutral-200" />
      <div className="px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-rm-neutral-500">
        Distribute
      </div>
      <button
        type="button"
        className={itemClass}
        disabled={!canDistribute}
        onClick={() => run(() => controller.distributeSelection("horizontal"))}
      >
        Horizontally
      </button>
      <button
        type="button"
        className={itemClass}
        disabled={!canDistribute}
        onClick={() => run(() => controller.distributeSelection("vertical"))}
      >
        Vertically
      </button>

      <div className="my-1 border-t border-rm-neutral-200" />

      <button type="button" className={itemClass} onClick={() => run(() => controller.bringForward())}>
        Bring Forward
      </button>
      <button type="button" className={itemClass} onClick={() => run(() => controller.sendBackward())}>
        Send Backward
      </button>
      <button type="button" className={itemClass} onClick={() => run(() => controller.bringToFront())}>
        Bring to Front
      </button>
      <button type="button" className={itemClass} onClick={() => run(() => controller.sendToBack())}>
        Send to Back
      </button>

      <div className="my-1 border-t border-rm-neutral-200" />

      <button
        type="button"
        className={`${itemClass} text-rm-neutral-900`}
        onClick={() => run(() => controller.deleteSelected())}
      >
        Delete
      </button>
    </div>
  );
}
