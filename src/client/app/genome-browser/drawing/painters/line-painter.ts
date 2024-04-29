import type { LineInstance } from "../../shapes/line";
import type { LinearScale } from "../linearScale";
import type { Viewport } from "../../types/viewport";

type EmptyRectanglePainterParams = {
  canvasContext: CanvasRenderingContext2D;
  shape: LineInstance;
  scale: LinearScale;
  viewport: Viewport;
}

const emptyRectanglePainter = (params: EmptyRectanglePainterParams) => {
  const { shape, canvasContext, viewport, scale } = params;

  const xStart = scale(shape.xStart - viewport.start);
  const xEnd = scale(shape.xEnd - viewport.start);
  const y = 100 + shape.yStart;

  canvasContext.save();
  canvasContext.strokeStyle = shape.color;

  // const linePath = new Path2D();
  // linePath.moveTo(xStart, y);
  // linePath.lineTo(xEnd, y);
  // canvasContext.stroke(linePath);

  canvasContext.beginPath();
  canvasContext.moveTo(xStart, y);
  canvasContext.lineTo(xEnd, y);

  canvasContext.stroke();
  canvasContext.restore();
};

export default emptyRectanglePainter;
