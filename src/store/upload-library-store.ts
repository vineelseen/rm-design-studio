import { create } from "zustand";

import type { UploadGroup, UploadedAsset } from "@/types/project";

const GROUPS_KEY = "rm-design-studio:upload-groups";
const ASSETS_KEY = "rm-design-studio:upload-assets";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

interface UploadLibraryState {
  groups: UploadGroup[];
  assets: UploadedAsset[];
  activeGroupId: string | "all" | "ungrouped";
  hydrated: boolean;
  hydrate: () => void;
  setActiveGroupId: (groupId: string | "all" | "ungrouped") => void;
  createGroup: (name: string) => UploadGroup;
  renameGroup: (groupId: string, name: string) => void;
  deleteGroup: (groupId: string) => void;
  addAsset: (asset: Omit<UploadedAsset, "id" | "createdAt" | "groupId">, groupId?: string | null) => UploadedAsset;
  moveAssetToGroup: (assetId: string, groupId: string | null) => void;
  renameAsset: (assetId: string, name: string) => void;
  deleteAsset: (assetId: string) => void;
  getFilteredAssets: () => UploadedAsset[];
}

export const useUploadLibraryStore = create<UploadLibraryState>((set, get) => ({
  groups: [],
  assets: [],
  activeGroupId: "all",
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const groups = readJson<UploadGroup[]>(GROUPS_KEY, []);
    const assets = readJson<UploadedAsset[]>(ASSETS_KEY, []).map((asset) => ({
      ...asset,
      groupId: asset.groupId ?? null,
    }));
    set({ groups, assets, hydrated: true });
  },

  setActiveGroupId: (groupId) => set({ activeGroupId: groupId }),

  createGroup: (name) => {
    const group: UploadGroup = {
      id: createId("upload-group"),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    const groups = [...get().groups, group];
    writeJson(GROUPS_KEY, groups);
    set({ groups });
    return group;
  },

  renameGroup: (groupId, name) => {
    const groups = get().groups.map((group) =>
      group.id === groupId ? { ...group, name: name.trim() } : group,
    );
    writeJson(GROUPS_KEY, groups);
    set({ groups });
  },

  deleteGroup: (groupId) => {
    const groups = get().groups.filter((group) => group.id !== groupId);
    const assets = get().assets.map((asset) =>
      asset.groupId === groupId ? { ...asset, groupId: null } : asset,
    );
    writeJson(GROUPS_KEY, groups);
    writeJson(ASSETS_KEY, assets);
    set({
      groups,
      assets,
      activeGroupId: get().activeGroupId === groupId ? "all" : get().activeGroupId,
    });
  },

  addAsset: (asset, groupId) => {
    const resolvedGroupId =
      groupId ??
      (get().activeGroupId !== "all" && get().activeGroupId !== "ungrouped"
        ? get().activeGroupId
        : null);

    const record: UploadedAsset = {
      id: createId("upload-asset"),
      name: asset.name,
      dataUrl: asset.dataUrl,
      type: asset.type,
      groupId: resolvedGroupId,
      createdAt: new Date().toISOString(),
    };

    const assets = [...get().assets, record];
    writeJson(ASSETS_KEY, assets);
    set({ assets });
    return record;
  },

  moveAssetToGroup: (assetId, groupId) => {
    const assets = get().assets.map((asset) =>
      asset.id === assetId ? { ...asset, groupId } : asset,
    );
    writeJson(ASSETS_KEY, assets);
    set({ assets });
  },

  renameAsset: (assetId, name) => {
    const assets = get().assets.map((asset) =>
      asset.id === assetId ? { ...asset, name: name.trim() } : asset,
    );
    writeJson(ASSETS_KEY, assets);
    set({ assets });
  },

  deleteAsset: (assetId) => {
    const assets = get().assets.filter((asset) => asset.id !== assetId);
    writeJson(ASSETS_KEY, assets);
    set({ assets });
  },

  getFilteredAssets: () => {
    const { assets, activeGroupId } = get();
    if (activeGroupId === "all") return assets;
    if (activeGroupId === "ungrouped") {
      return assets.filter((asset) => !asset.groupId);
    }
    return assets.filter((asset) => asset.groupId === activeGroupId);
  },
}));
