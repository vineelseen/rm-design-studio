import { ContextualToolbar } from "@/components/editor/ContextualToolbar";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { ToolPanel } from "@/components/editor/ToolPanel";
import { ToolRail } from "@/components/editor/ToolRail";
import { Workspace } from "@/components/editor/Workspace";
import { StatusBar } from "./StatusBar";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="grid h-full min-w-[1280px] grid-rows-[auto_auto_1fr_auto] bg-rm-neutral-50">
      <TopBar />
      <ContextualToolbar />

      <div className="grid min-h-0 grid-cols-[auto_auto_1fr_300px]">
        <ToolRail />
        <ToolPanel />
        <Workspace />
        <PropertiesPanel />
      </div>

      <StatusBar />
    </div>
  );
}
