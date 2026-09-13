export function BrochureCanvasPlaceholder() {
  return (
    <article
      className="flex aspect-[210/297] h-full max-h-[calc(100%-48px)] w-auto max-w-full flex-col bg-rm-white shadow-[0_2px_8px_rgba(23,29,40,0.08),0_0_1px_rgba(23,29,40,0.12)]"
      aria-label="Brochure page preview"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-12 text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
          Product Brochure
        </p>
        <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-rm-neutral-900">
          T501 Gen2
        </h1>
        <p className="mt-3 font-body text-lg leading-8 text-rm-neutral-600">
          Advanced Monitoring System
        </p>
      </div>
    </article>
  );
}
