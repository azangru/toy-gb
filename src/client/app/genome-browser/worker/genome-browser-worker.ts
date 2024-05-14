import Painter from '../drawing';

import rulerProgram from '../programs/ruler';
import { geneProgram } from '../programs/genes';

import type { OffscreenCanvasMessage, RenderMessage, RenderCompleteMessage } from "./worker-message-type";
import type { Viewport } from '../controllers/viewport-controller';
import type { Shape } from '../shapes/shape-types';

const scope = self as unknown as DedicatedWorkerGlobalScope

let canvas: OffscreenCanvas | undefined = undefined;
let canvasContext: OffscreenCanvasRenderingContext2D;
let painter: Painter;
let devicePixelRatio: number;

scope.addEventListener('message', event => {
  const data = event.data;

  if (isOffscreenCanvasMessage(data)) {
    setUpCanvas(data);
    setUpPainter(data);
  } else if (isRenderMessage(data)) {
    render(data);
  }
});

const setUpCanvas = (params: OffscreenCanvasMessage) => {
  canvas = params.canvas;
  canvasContext = canvas.getContext('2d');
  devicePixelRatio = params.devicePixelRatio;
  canvasContext.scale(devicePixelRatio, devicePixelRatio);
};

const setUpPainter = (params: OffscreenCanvasMessage) => {
  painter = new Painter({
    canvasContext: canvasContext as OffscreenCanvasRenderingContext2D,
    canvasWidth: params.width,
    canvasHeight: params.height
  });
};

// TODO: let main thread know that rendering has finished
const render = async (data: RenderMessage) => {
  const viewport = data.viewport;
  const shapes = await prepareShapes(viewport);
  clearCanvas();
  paintShapes({ shapes, viewport });

  const renderCompleteMessage: RenderCompleteMessage = {
    type: 'render-complete'
  };
  postMessage(renderCompleteMessage);
};

const clearCanvas = () => {
  canvasContext.reset();
  canvasContext.scale(devicePixelRatio, devicePixelRatio);
};

const prepareShapes = async (viewport: Viewport) => {
  const programs = [
    rulerProgram,
    geneProgram
  ];

  const shapePromises = programs.map(program => program({
    viewport,
    genome_id: 'human', // TODO: pass through properties
    region_name: '13' // TODO: pass through properties
  }));

  const shapes = await Promise.all(shapePromises).then(shapesArr => shapesArr.flat());

  return shapes;
};

const paintShapes = ({shapes, viewport}: {shapes: Shape[]; viewport: Viewport}) => {
  console.log('painting');
  painter.setShapes(shapes);
  painter.paint({ viewport });
};



// validation

const isOffscreenCanvasMessage = (message: unknown): message is OffscreenCanvasMessage => {
  return message &&
    typeof message === 'object' &&
    'type' in message &&
    message.type === 'offscreen-canvas';
};


const isRenderMessage = (message: unknown): message is RenderMessage => {
  return message &&
    typeof message === 'object' &&
    'type' in message &&
    message.type === 'render';
};
