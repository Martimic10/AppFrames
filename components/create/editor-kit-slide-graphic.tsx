"use client";

import { useRef } from "react";
import { DraggableSlideGraphic } from "@/components/create/draggable-slide-graphic";
import {
  graphicMaxHeightPercent,
  graphicMaxWidthPercent,
  resolveGraphicPosition,
  type GraphicPosition
} from "@/components/create/graphic-position";

type EditorKitSlideGraphicProps = {
  imageDataUrl: string | null;
  graphicPosition?: GraphicPosition | null;
  hasScreenshot: boolean;
  selected: boolean;
  onGraphicPositionChange: (position: GraphicPosition) => void;
  onGraphicRemove: () => void;
};

export function EditorKitSlideGraphic({
  imageDataUrl,
  graphicPosition,
  hasScreenshot,
  selected,
  onGraphicPositionChange,
  onGraphicRemove
}: EditorKitSlideGraphicProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  if (!imageDataUrl) {
    return null;
  }

  const position = resolveGraphicPosition(graphicPosition, hasScreenshot);
  const editable = selected;

  return (
    <div ref={frameRef} className="pointer-events-none absolute inset-0 z-[13]">
      <DraggableSlideGraphic
        frameRef={frameRef}
        position={position}
        maxWidthPercent={graphicMaxWidthPercent(hasScreenshot)}
        maxHeightPercent={graphicMaxHeightPercent(hasScreenshot)}
        imageDataUrl={imageDataUrl}
        editable={editable}
        onPositionChange={onGraphicPositionChange}
        onRemove={editable ? onGraphicRemove : undefined}
      />
    </div>
  );
}
