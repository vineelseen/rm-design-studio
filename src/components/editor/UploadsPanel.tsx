"use client";

import { FolderPlus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui";
import { handleFilesUpload } from "@/lib/upload-utils";
import { useDesignEditorStore, useUploadLibraryStore } from "@/store";

export function UploadsPanel() {
  const canvasController = useDesignEditorStore((state) => state.canvasController);
  const hydrate = useUploadLibraryStore((state) => state.hydrate);
  const groups = useUploadLibraryStore((state) => state.groups);
  const activeGroupId = useUploadLibraryStore((state) => state.activeGroupId);
  const setActiveGroupId = useUploadLibraryStore((state) => state.setActiveGroupId);
  const createGroup = useUploadLibraryStore((state) => state.createGroup);
  const renameGroup = useUploadLibraryStore((state) => state.renameGroup);
  const deleteGroup = useUploadLibraryStore((state) => state.deleteGroup);
  const moveAssetToGroup = useUploadLibraryStore((state) => state.moveAssetToGroup);
  const renameAsset = useUploadLibraryStore((state) => state.renameAsset);
  const deleteAsset = useUploadLibraryStore((state) => state.deleteAsset);
  const getFilteredAssets = useUploadLibraryStore((state) => state.getFilteredAssets);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const assets = getFilteredAssets().filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase()),
  );

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    await handleFilesUpload(files, canvasController);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    createGroup(trimmed);
    setNewGroupName("");
  };

  const addAssetToCanvas = async (asset: {
    type: "image" | "svg";
    dataUrl: string;
    name: string;
  }) => {
    if (!canvasController) return;
    if (asset.type === "svg") {
      const svg = asset.dataUrl.startsWith("data:")
        ? decodeURIComponent(asset.dataUrl.replace(/^data:image\/svg\+xml[^,]*,/, ""))
        : asset.dataUrl;
      await canvasController.addSvgFromString(svg, asset.name);
      return;
    }
    await canvasController.addImageFromDataUrl(asset.dataUrl, asset.name);
  };

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="size-3.5" />
        Upload Files
      </Button>

      <div className="flex gap-2">
        <input
          value={newGroupName}
          onChange={(event) => setNewGroupName(event.target.value)}
          placeholder="New group name"
          className="h-8 flex-1 rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
          onKeyDown={(event) => {
            if (event.key === "Enter") handleCreateGroup();
          }}
        />
        <Button variant="secondary" onClick={handleCreateGroup}>
          <FolderPlus className="size-3.5" />
          New Group
        </Button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search uploads"
        className="h-8 w-full rounded-sm border border-rm-neutral-300 px-2 font-body text-sm"
      />

      <div
        className="rounded-sm border border-dashed border-rm-neutral-300 bg-rm-neutral-50 px-3 py-6 text-center font-body text-sm text-rm-neutral-500"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void onUpload(event.dataTransfer.files);
        }}
      >
        Drag and drop images here
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        multiple
        className="hidden"
        onChange={(event) => void onUpload(event.target.files)}
      />

      <div className="space-y-2">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-rm-neutral-500">
          Groups
        </p>
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all" as const, label: "All Uploads" },
            { id: "ungrouped" as const, label: "Ungrouped" },
            ...groups.map((group) => ({ id: group.id, label: group.name })),
          ].map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroupId(group.id)}
              className={`rounded-sm border px-2 py-1 font-body text-xs ${
                activeGroupId === group.id
                  ? "border-rm-blue-600 bg-rm-blue-50 text-rm-blue-600"
                  : "border-rm-neutral-200 text-rm-neutral-700"
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-1">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between rounded-sm border border-rm-neutral-200 px-2 py-1"
            >
              <button
                type="button"
                className="truncate font-body text-xs text-rm-neutral-700"
                onDoubleClick={() => {
                  const next = window.prompt("Rename group", group.name);
                  if (next?.trim()) renameGroup(group.id, next.trim());
                }}
              >
                {group.name}
              </button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (window.confirm(`Delete group "${group.name}"? Assets will move to Ungrouped.`)) {
                    deleteGroup(group.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {assets.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="overflow-hidden rounded-sm border border-rm-neutral-200"
            >
              <button
                type="button"
                onClick={() => void addAssetToCanvas(asset)}
                className="block w-full"
              >
                {asset.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.dataUrl}
                    alt={asset.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-rm-neutral-50 font-body text-xs text-rm-neutral-500">
                    SVG
                  </div>
                )}
              </button>
              <div className="space-y-1 px-2 py-1">
                <div className="truncate font-body text-[10px] text-rm-neutral-600">
                  {asset.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="font-body text-[10px] text-rm-blue-600"
                    onClick={() => void addAssetToCanvas(asset)}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="font-body text-[10px] text-rm-neutral-500"
                    onClick={() => {
                      const next = window.prompt("Rename asset", asset.name);
                      if (next?.trim()) renameAsset(asset.id, next.trim());
                    }}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="font-body text-[10px] text-rm-neutral-500"
                    onClick={() => deleteAsset(asset.id)}
                  >
                    Delete
                  </button>
                  {groups.length > 0 ? (
                    <select
                      value={asset.groupId ?? ""}
                      onChange={(event) =>
                        moveAssetToGroup(
                          asset.id,
                          event.target.value ? event.target.value : null,
                        )
                      }
                      className="h-6 rounded-sm border border-rm-neutral-300 px-1 font-body text-[10px]"
                    >
                      <option value="">Ungrouped</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-body text-sm text-rm-neutral-500">No uploads yet.</p>
      )}
    </div>
  );
}
