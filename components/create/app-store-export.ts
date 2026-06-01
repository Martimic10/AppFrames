"use client";

import { toPng } from "html-to-image";
import JSZip from "jszip";
import type { ExportQualityId, ExportRenderOptions } from "@/components/create/app-store-export-config";
import type { AppStoreExportSize } from "@/components/create/app-store-export-config";
export type {
  AppStoreExportSizeId,
  ExportQualityId,
  ExportRenderOptions,
  AppStoreExportSize
} from "@/components/create/app-store-export-config";

export {
  APP_STORE_EXPORT_SIZES,
  DEFAULT_APP_STORE_EXPORT_SIZE_ID,
  EXPORT_QUALITY_OPTIONS,
  formatSlideExportFileName,
  getAppStoreExportSize,
  sanitizeExportBaseName
} from "@/components/create/app-store-export-config";

const QUALITY_CAPTURE_SCALE: Record<ExportQualityId, number> = {
  standard: 0.78,
  hd: 1,
  "4k": 1
};

const QUALITY_OUTPUT_SCALE: Record<ExportQualityId, number> = {
  standard: 1,
  hd: 1,
  "4k": 1.25
};

type ExportImageLayer = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
};

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function decodeImageElement(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    if (img.decode) {
      try {
        await img.decode();
      } catch {
        /* already painted */
      }
    }
    return;
  }

  await new Promise<void>((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    if (img.src) {
      const src = img.src;
      img.src = "";
      img.src = src;
    } else {
      resolve();
    }
  });

  if (img.decode && img.naturalWidth > 0) {
    try {
      await img.decode();
    } catch {
      /* ignore */
    }
  }
}

async function ensureImagesLoaded(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((img) => decodeImageElement(img)));
}

function hideEditorOnlyNodes(frame: HTMLElement): () => void {
  const restores: Array<() => void> = [];

  frame.querySelectorAll("[data-editor-only]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    restores.push(() => {
      node.style.removeProperty("display");
    });
    node.style.display = "none";
  });

  return () => {
    for (const restore of restores) restore();
  };
}

function resolveLayerSrc(host: HTMLElement, img: HTMLImageElement | null): string {
  if (img?.src) return img.src;
  const fromHost = host.dataset.screenshotSrc ?? host.dataset.graphicSrc;
  if (fromHost) return fromHost;
  return "";
}

async function pinExportImageHost(
  frame: HTMLElement,
  node: HTMLElement,
  widthPct: number,
  maxHeightPct: number | null
): Promise<{ layer: ExportImageLayer | null; restore: () => void }> {
  const frameW = frame.offsetWidth;
  const frameH = frame.offsetHeight;
  const leftPct = Number.parseFloat(node.style.left || "50");
  const topPct = Number.parseFloat(node.style.top || "50");
  const rotateDeg = Number.parseFloat(node.dataset.mockupRotate ?? "0");
  const scaleMulRaw = Number.parseFloat(
    node.dataset.graphicScaleMul ?? node.dataset.mockupScaleMul ?? "1"
  );
  const scaleMul = Number.isFinite(scaleMulRaw) && scaleMulRaw > 0 ? scaleMulRaw : 1;

  const targetWidth = Math.round(
    frameW * (Math.min(92, Math.max(20, Number.isFinite(widthPct) ? widthPct : 52)) / 100) * scaleMul
  );

  const prevWidth = node.style.width;
  const prevHeight = node.style.height;
  const prevMinHeight = node.style.minHeight;
  const prevMaxHeight = node.style.maxHeight;
  const prevTransform = node.style.transform;
  const prevLeft = node.style.left;
  const prevTop = node.style.top;
  const prevVisibility = node.style.visibility;

  node.style.width = `${targetWidth}px`;
  node.style.height = "auto";
  node.style.minHeight = "0";
  node.style.transform = "none";

  const img = node.querySelector("[data-export-screenshot], img");
  if (img instanceof HTMLImageElement) {
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.maxWidth = "none";
    img.style.maxHeight = "none";
    await decodeImageElement(img);
  }

  let hostHeight = node.offsetHeight;
  if (
    hostHeight <= 0 &&
    img instanceof HTMLImageElement &&
    img.naturalWidth > 0 &&
    img.naturalHeight > 0
  ) {
    hostHeight = Math.round((targetWidth * img.naturalHeight) / img.naturalWidth);
    node.style.height = `${hostHeight}px`;
  }

  if (maxHeightPct != null && Number.isFinite(maxHeightPct)) {
    const maxHeightPx = Math.round(frameH * (Math.min(92, Math.max(20, maxHeightPct)) / 100));
    if (hostHeight > maxHeightPx) {
      hostHeight = maxHeightPx;
      node.style.height = `${hostHeight}px`;
      if (img instanceof HTMLImageElement) {
        img.style.height = "100%";
        img.style.width = "auto";
        img.style.maxHeight = `${hostHeight}px`;
      }
    }
  }

  const left = (leftPct / 100) * frameW - targetWidth / 2;
  const top = (topPct / 100) * frameH - hostHeight / 2;
  node.style.left = `${left}px`;
  node.style.top = `${top}px`;

  const src = resolveLayerSrc(node, img instanceof HTMLImageElement ? img : null);
  node.style.visibility = "hidden";

  return {
    layer:
      src && hostHeight > 0
        ? {
            src,
            x: left,
            y: top,
            width: targetWidth,
            height: hostHeight,
            ...(rotateDeg ? { rotate: rotateDeg } : {})
          }
        : null,
    restore: () => {
      node.style.width = prevWidth;
      node.style.height = prevHeight;
      node.style.minHeight = prevMinHeight;
      node.style.maxHeight = prevMaxHeight;
      node.style.transform = prevTransform;
      node.style.left = prevLeft;
      node.style.top = prevTop;
      node.style.visibility = prevVisibility;
      if (img instanceof HTMLImageElement) {
        img.style.removeProperty("width");
        img.style.removeProperty("height");
        img.style.removeProperty("display");
        img.style.removeProperty("max-width");
        img.style.removeProperty("max-height");
      }
    }
  };
}

/** Pin mockup/graphic hosts in pixels and collect layers for canvas composite. */
async function prepareExportCompositeLayers(frame: HTMLElement): Promise<{
  layers: ExportImageLayer[];
  restore: () => void;
}> {
  const restores: Array<() => void> = [];
  const layers: ExportImageLayer[] = [];

  const mockupHosts = Array.from(
    frame.querySelectorAll("[data-export-device-host]")
  ).filter((node): node is HTMLElement => node instanceof HTMLElement);

  for (const node of mockupHosts) {
    const widthPct = Number.parseFloat(node.dataset.mockupWidthPercent ?? "52");
    const pinned = await pinExportImageHost(frame, node, widthPct, null);
    if (pinned.layer) layers.push(pinned.layer);
    restores.push(pinned.restore);
  }

  const graphicHosts = Array.from(
    frame.querySelectorAll("[data-export-graphic-host]")
  ).filter((node): node is HTMLElement => node instanceof HTMLElement);

  for (const node of graphicHosts) {
    const widthPct = Number.parseFloat(node.dataset.graphicWidthPercent ?? "56");
    const maxHeightPct = Number.parseFloat(node.dataset.graphicMaxHeightPercent ?? "40");
    const pinned = await pinExportImageHost(frame, node, widthPct, maxHeightPct);
    if (pinned.layer) layers.push(pinned.layer);
    restores.push(pinned.restore);
  }

  return {
    layers,
    restore: () => {
      for (const restore of restores) restore();
    }
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load export image"));
    img.src = src;
  });
}

/** Draw screenshots onto the captured frame (Safari-safe; does not rely on html-to-image for imgs). */
async function compositeImagesOntoDataUrl(
  dataUrl: string,
  layers: ExportImageLayer[],
  width: number,
  height: number,
  pixelRatio: number
): Promise<string> {
  if (layers.length === 0) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create export composite canvas");

  const base = await loadImage(dataUrl);
  ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

  for (const layer of layers) {
    try {
      const shot = await loadImage(layer.src);
      const drawX = layer.x * pixelRatio;
      const drawY = layer.y * pixelRatio;
      const drawW = layer.width * pixelRatio;
      const drawH = layer.height * pixelRatio;

      if (layer.rotate) {
        const centerX = drawX + drawW / 2;
        const centerY = drawY + drawH / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((layer.rotate * Math.PI) / 180);
        ctx.drawImage(shot, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        ctx.drawImage(shot, drawX, drawY, drawW, drawH);
      }
    } catch {
      /* skip broken layer */
    }
  }

  return canvas.toDataURL("image/png");
}

/** Scale/crop capture to exact App Store pixel dimensions (PNG). */
export async function resizeImageToAppStoreSize(
  dataUrl: string,
  width: number,
  height: number
): Promise<Blob> {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create export canvas");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  const scale = Math.max(width / img.width, height / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))),
      "image/png"
    );
  });
}

async function applyWatermarkToBlob(blob: Blob, width: number, height: number): Promise<Blob> {
  const img = await loadImage(URL.createObjectURL(blob));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create watermark canvas");

  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(img.src);

  const fontSize = Math.max(14, Math.round(width * 0.022));
  const padding = Math.round(fontSize * 0.85);
  const label = "AppFrames";

  ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  const metrics = ctx.measureText(label);
  const boxW = metrics.width + padding * 1.4;
  const boxH = fontSize + padding * 0.9;
  const x = width - padding;
  const y = height - padding;

  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.beginPath();
  ctx.roundRect(x - boxW, y - boxH, boxW, boxH, 6);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.fillText(label, x - padding * 0.35, y - padding * 0.35);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("Watermark failed"))),
      "image/png"
    );
  });
}

export async function captureFrameAsAppStoreBlob(
  frameElement: HTMLElement,
  size: Pick<AppStoreExportSize, "width" | "height">,
  render: ExportRenderOptions = { quality: "hd", watermark: false }
): Promise<Blob> {
  const width = frameElement.offsetWidth;
  const height = frameElement.offsetHeight;
  if (width <= 0 || height <= 0) {
    throw new Error("Slide preview is not visible. Try zooming the canvas to 100%.");
  }

  const captureScale = QUALITY_CAPTURE_SCALE[render.quality];
  const outputScale = QUALITY_OUTPUT_SCALE[render.quality];
  const outW = Math.round(size.width * outputScale);
  const outH = Math.round(size.height * outputScale);
  const pixelRatio = (size.width / width) * captureScale;

  const card = frameElement.closest("[data-composition-card]");
  if (card instanceof HTMLElement) {
    card.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" });
  }
  await waitForPaint();

  const restoreEditorOnly = hideEditorOnlyNodes(frameElement);
  await ensureImagesLoaded(frameElement);
  const { layers, restore: restoreMockups } = await prepareExportCompositeLayers(frameElement);
  await waitForPaint();

  let dataUrl: string;
  try {
    dataUrl = await toPng(frameElement, {
      cacheBust: false,
      pixelRatio,
      width,
      height,
      skipFonts: false,
      filter: (node) => {
        if (node instanceof HTMLElement && node.hasAttribute("data-editor-only")) {
          return false;
        }
        return true;
      }
    });
    dataUrl = await compositeImagesOntoDataUrl(
      dataUrl,
      layers,
      width,
      height,
      pixelRatio
    );
  } finally {
    restoreMockups();
    restoreEditorOnly();
  }

  let blob = await resizeImageToAppStoreSize(dataUrl, outW, outH);

  if (render.watermark) {
    blob = await applyWatermarkToBlob(blob, outW, outH);
  }

  return blob;
}

export function getCompositionFrameElement(slideIndex: number): HTMLElement | null {
  const card = document.querySelector(
    `[data-composition-card][data-slide-index="${slideIndex}"]`
  );
  if (!(card instanceof HTMLElement)) return null;
  const frame = card.querySelector(
    ".composition-frame, .template-kit-portrait-slide"
  );
  return frame instanceof HTMLElement ? frame : card;
}

export function scrollCompositionCardIntoView(slideIndex: number): void {
  const card = document.querySelector(
    `[data-composition-card][data-slide-index="${slideIndex}"]`
  );
  card?.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" });
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function buildAppStoreZip(
  files: { name: string; blob: Blob }[]
): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  return zip.generateAsync({ type: "blob" });
}
