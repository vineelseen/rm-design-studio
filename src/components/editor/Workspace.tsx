import { BrochureCanvasPlaceholder } from "./BrochureCanvasPlaceholder";

export function Workspace() {
  return (
    <main
      className="flex min-w-0 items-center justify-center overflow-auto bg-rm-neutral-100 p-8"
      aria-label="Document workspace"
    >
      <BrochureCanvasPlaceholder />
    </main>
  );
}
