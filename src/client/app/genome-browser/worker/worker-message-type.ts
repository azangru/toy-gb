import type { Viewport } from '../controllers/viewport-controller';

/**
 * - pass the offscreen canvas
 */

export type MainToWorkerMessage =
  | OffscreenCanvasMessage
  | RenderMessage;

export type OffscreenCanvasMessage = {
  type: 'offscreen-canvas';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  devicePixelRatio: number;
};

export type RenderMessage = {
  type: 'render';
  viewport: Viewport;
};
