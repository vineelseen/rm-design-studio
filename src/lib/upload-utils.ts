import type { CanvasController } from "@/lib/canvas-controller";
import {
  createUploadedAsset,
  useDesignEditorStore,
} from "@/store/design-editor-store";

export async function handleFileUpload(
  file: File,
  canvasController: CanvasController | null,
) {
  if (!canvasController) return;

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isSvg = extension === "svg" || file.type === "image/svg+xml";
  const isRaster =
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "webp" ||
    file.type.startsWith("image/");

  if (isSvg) {
    const text = await file.text();
    await canvasController.addSvgFromString(text, file.name);
    useDesignEditorStore
      .getState()
      .addUploadedAsset(createUploadedAsset(file.name, `data:image/svg+xml;base64,${btoa(text)}`, "svg"));
    return;
  }

  if (!isRaster) return;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Invalid file result"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  await canvasController.addImageFromDataUrl(dataUrl, file.name);
  useDesignEditorStore
    .getState()
    .addUploadedAsset(createUploadedAsset(file.name, dataUrl, "image"));
}

export async function handleFilesUpload(
  files: FileList | File[],
  canvasController: CanvasController | null,
) {
  for (const file of Array.from(files)) {
    await handleFileUpload(file, canvasController);
  }
}
