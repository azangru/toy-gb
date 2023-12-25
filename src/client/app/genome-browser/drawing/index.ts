import type { Shape } from "../shapes/shape-types";
import type { Viewport } from "../types/viewport";

import getLinearScale from "./linearScale";

import PaintersMap from "./painters/painters-map";

class Painter {
  canvas: HTMLCanvasElement;
  shapes: Shape[] = [];
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasWidth = canvas.width / devicePixelRatio; // TODO: maybe do this nicer
    this.canvasHeight = canvas.height / devicePixelRatio; // TODO: maybe do this nicer
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
        canvasContext: this.canvas.getContext('2d'),
        shape,
        scale,
        viewport
       });
    }
  }
}


export default Painter;
