import { A4Page, T501Cover } from "@/components/brochure";

export function Workspace() {
  return (
    <main
      className="@container-size flex h-full min-h-0 w-full items-center justify-center overflow-auto bg-rm-neutral-100 p-5"
      aria-label="Document workspace"
    >
      <A4Page>
        <T501Cover />
      </A4Page>
    </main>
  );
}
