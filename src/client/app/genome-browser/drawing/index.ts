import type { Shape } from "../shapes/shape-types";
import type { Viewport } from "../types/viewport";

import getLinearScale from "./linearScale";

import PaintersMap from "./painters/painters-map";

class Painter {
  canvasContext: OffscreenCanvasRenderingContext2D;
  shapes: Shape[] = [];
  canvasWidth: number;
  canvasHeight: number;

  constructor({
    canvasContext,
    canvasWidth,
    canvasHeight
  }: {
    canvasContext: OffscreenCanvasRenderingContext2D;
    canvasWidth: number;
    canvasHeight: number;
  }) {
    this.canvasContext = canvasContext;
    // FIXME: this should be readjusted on resize
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  // NOTE: this is probably wrong — we need a concept of tracks
  setShapes(shapes: Shape[]) {
    this.shapes = shapes;
  }

  paint({ viewport }: { viewport: Viewport }) {
    const scale = getLinearScale({
      domain: [viewport.start, viewport.end],
      range: [0, this.canvasWidth]
    });

    for (const shape of this.shapes) {
      const painter = PaintersMap[shape.type];

      // TODO: need better types
      painter({ 
        canvasContext: this.canvasContext,
        shape,
        scale,
        viewport
       });
    }
  }
}


export default Painter;
