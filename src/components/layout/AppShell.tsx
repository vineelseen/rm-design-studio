import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Workspace } from "@/components/editor/Workspace";
import { LeftSidebar } from "./LeftSidebar";
import { StatusBar } from "./StatusBar";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="grid h-full min-w-[1280px] grid-rows-[auto_1fr_auto] bg-rm-neutral-50">
      <TopBar />

      <div className="grid min-h-0 grid-cols-[250px_1fr_300px]">
        <LeftSidebar />
        <Workspace />
        <PropertiesPanel />
      </div>

      <StatusBar />
    </div>
  );
}
