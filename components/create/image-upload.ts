const IMAGE_EXTENSION = /\.(avif|bmp|gif|hei[cf]|jpe?g|png|svg|webp)$/i;

export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXTENSION.test(file.name);
}

/** Stable order when users multi-select (e.g. 1.png, 2.png, … 10.png). */
export function sortImageFiles(files: Iterable<File>): File[] {
  return [...files]
    .filter(isImageFile)
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
    );
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function readImageFilesAsDataUrls(
  files: Iterable<File>,
  maxCount: number
): Promise<string[]> {
  if (maxCount <= 0) return [];
  const images = sortImageFiles(files).slice(0, maxCount);
  const dataUrls: string[] = [];

  for (const file of images) {
    try {
      dataUrls.push(await readFileAsDataUrl(file));
    } catch {
      // Skip unreadable files; continue with the rest.
    }
  }

  return dataUrls;
}

/** Collect image files from a drop (file list or items API). */
export function getImageFilesFromDataTransfer(dataTransfer: DataTransfer): File[] {
  const fromList = dataTransfer.files?.length
    ? Array.from(dataTransfer.files)
    : [];

  if (fromList.length > 0) {
    return sortImageFiles(fromList);
  }

  const fromItems: File[] = [];
  for (const item of Array.from(dataTransfer.items ?? [])) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (file && isImageFile(file)) fromItems.push(file);
  }

  return sortImageFiles(fromItems);
}

export function getImageFilesFromFileList(fileList: FileList | null): File[] {
  if (!fileList?.length) return [];
  return sortImageFiles(Array.from(fileList));
}

export function collectImageFiles(files: Iterable<File>): File[] {
  return sortImageFiles(files);
}

export type AutoFillResult = {
  ok: boolean;
  filled: number;
  slideCount: number;
  message?: string;
};

export type StagedScreenshot = {
  id: string;
  name: string;
  dataUrl: string;
};

export async function readImageFilesWithMeta(
  files: Iterable<File>
): Promise<Array<{ name: string; dataUrl: string }>> {
  const images = sortImageFiles(files);
  const results: Array<{ name: string; dataUrl: string }> = [];

  for (const file of images) {
    try {
      results.push({ name: file.name, dataUrl: await readFileAsDataUrl(file) });
    } catch {
      // Skip unreadable files.
    }
  }

  return results;
}
