import type { SolidRectangleInstance } from "../../shapes/solid-rectangle";
import type { LinearScale } from "../linearScale";
import type { Viewport } from "../../types/viewport";

type RulerPainterParams = {
  canvasContext: CanvasRenderingContext2D;
  shape: SolidRectangleInstance;
  scale: LinearScale;
  viewport: Viewport;
}

const solidRectanglePainter = (params: RulerPainterParams) => {
  const { shape, canvasContext, viewport, scale } = params;

  const x = scale(shape.x - viewport.start);
  const width = Math.max(scale(shape.width), 1); // scale(shape.width);
  const y = 100 + shape.y; // track y hard-coded
  const height = 10; //shape.height;

  canvasContext.rect(x, y, width, height);
};

export default solidRectanglePainter;
