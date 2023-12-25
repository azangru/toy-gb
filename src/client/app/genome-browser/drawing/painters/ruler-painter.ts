import type { RulerInstance } from "../../shapes/ruler";
import type { LinearScale } from "../linearScale";
import type { Viewport } from "../../types/viewport";

type RulerPainterParams = {
  canvasContext: CanvasRenderingContext2D;
  shape: RulerInstance;
  scale: LinearScale;
  viewport: Viewport;
}

const rulerPainter = (params: RulerPainterParams) => {
  const { shape, canvasContext, viewport, scale } = params;
  const ticks = shape.ticks;

  for (const tick of ticks) {
    const bpDistance = tick - viewport.start;
    const x = scale(bpDistance);
    canvasContext.fillText(`${tick}`, x, 20);
  }
};

export default rulerPainter;
