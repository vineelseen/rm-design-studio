import type { CanvasController } from "@/lib/canvas-controller";
import { useUploadLibraryStore } from "@/store/upload-library-store";

export async function handleFileUpload(
  file: File,
  canvasController: CanvasController | null,
  addToCanvas = true,
) {
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
    const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
    useUploadLibraryStore.getState().addAsset({
      name: file.name,
      dataUrl,
      type: "svg",
    });
    if (addToCanvas && canvasController) {
      await canvasController.addSvgFromString(text, file.name);
    }
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

  useUploadLibraryStore.getState().addAsset({
    name: file.name,
    dataUrl,
    type: "image",
  });

  if (addToCanvas && canvasController) {
    await canvasController.addImageFromDataUrl(dataUrl, file.name);
  }
}

export async function handleFilesUpload(
  files: FileList | File[],
  canvasController: CanvasController | null,
  addToCanvas = true,
) {
  for (const file of Array.from(files)) {
    await handleFileUpload(file, canvasController, addToCanvas);
  }
}
