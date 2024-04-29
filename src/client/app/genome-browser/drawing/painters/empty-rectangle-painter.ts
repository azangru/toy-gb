import type { EmptyRectangleInstance } from "../../shapes/empty-rectangle";
import type { LinearScale } from "../linearScale";
import type { Viewport } from "../../types/viewport";

type EmptyRectanglePainterParams = {
  canvasContext: CanvasRenderingContext2D;
  shape: EmptyRectangleInstance;
  scale: LinearScale;
  viewport: Viewport;
}

const emptyRectanglePainter = (params: EmptyRectanglePainterParams) => {
  const { shape, canvasContext, viewport, scale } = params;

  const x = scale(shape.x - viewport.start);
  const width = Math.max(scale(shape.width), 1); // scale(shape.width);
  const y = 100 + shape.y; // track y hard-coded
  const height = shape.height;

  canvasContext.save();
  canvasContext.strokeStyle = shape.strokeColor;
  canvasContext.strokeRect(x, y, width, height);
  canvasContext.restore();
};

export default emptyRectanglePainter;
