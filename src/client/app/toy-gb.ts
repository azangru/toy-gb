import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import ViewportController from './genome-browser/controllers/viewport-controller';

import type { OffscreenCanvasMessage, RenderMessage } from './genome-browser/worker/worker-message-type';

@customElement('toy-gb')
class ToyGB extends LitElement {

  static styles = css`
    :host {
      display: block;
      position: relative;
      height: 100%;
      font-size: 0;
    }
    
    * {
      box-sizing: border-box;
    }
    
    canvas {
      position: absolute;
      height: 100%;
      width: 100%;
      background: rgba(255, 255, 224, 0.8);
    }
  `;

  @query('canvas')
  canvas!: HTMLCanvasElement;
  worker: Worker;

  isRendering = false;
  shouldRepaint = false;


  // viewport = {
  //   start: 2750000,
  //   end: 2751005
  // };
  // viewport = {
  //   start: 1,
  //   end: 35181319
  // }
  viewport = {
    start: 27066155,
    end: 27171811
  }

  genome_id: string = 'a7335667-93e7-11ec-a39d-005056b38ce3';
  region_name: string = '13';

  viewportController = new ViewportController(this, this.viewport);


  constructor() {
    super();
    this.worker = new Worker(new URL('./genome-browser/worker/genome-browser-worker.ts', import.meta.url), {
      type: 'module'
    });
    this.setupWorkerListeners();
  }

  setupWorkerListeners = () => {
    this.worker.addEventListener('message', (event) => {
      if (event.data.type === 'render-complete') {
        this.isRendering = false;

        if (this.shouldRepaint) {
          this.shouldRepaint = false;
          this.isRendering = true;
          this.repaintCanvas();
        }
      }
    });
  }

  firstUpdated() {
    this.initialiseCanvas();
    this.viewportController.registerCanvas(this.canvas);
    this.addListeners();


    // NOTE: this would have to be moved somewhere
    // this.executePrograms();
  }

  updated() {
    if (this.isRendering) {
      this.shouldRepaint = true;
    } else {
      this.repaintCanvas();
    }
  }

  initialiseCanvas() {
    if (!this.canvas) {
      return;
    }
    const { width, height } = this.getBoundingClientRect();
    const { devicePixelRatio } = window;
    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;
    const offscreenCanvas = this.canvas.transferControlToOffscreen();
    this.passCanvasToWorker(offscreenCanvas);
  }

  passCanvasToWorker = (canvas: OffscreenCanvas) => {
    const canvasWidth = this.canvas.width / devicePixelRatio;
    const canvasHeight = this.canvas.height / devicePixelRatio;
    const message: OffscreenCanvasMessage = {
      type: 'offscreen-canvas',
      canvas,
      width: canvasWidth,
      height: canvasHeight,
      devicePixelRatio: window.devicePixelRatio
    };
    this.worker.postMessage(message, [canvas]);
  };

  addListeners() {
    // const resizeObserver = new ResizeObserver((entries) => {
    //   const resizeObserverEntry = entries[0];
    //   const { width, height } = resizeObserverEntry.contentRect;
    //   const { devicePixelRatio } = window;
    //   this.canvas.width = width * devicePixelRatio;
    //   this.canvas.height = height * devicePixelRatio;
    //   this.canvasContext.scale(devicePixelRatio, devicePixelRatio);
    //   this.rerender();
    // });
    // resizeObserver.observe(this.canvas);
  }

  render() {
    return html`
      <canvas></canvas>
    `;
  }

  // hypothetically, this should be a queue: if you didn't have time to fit in a frame, you should skip a frame 
  repaintCanvas() {
    this.isRendering = true;

    const message: RenderMessage = {
      type: 'render',
      viewport: this.viewportController.viewport
    }
    this.worker.postMessage(message);
  }

  // public method for consumers of this element to send commands to it 
  send(message: { type: string, payload: unknown }) {
    if (message.type === 'goto') {
      this.goto(message.payload as Parameters<typeof this.goto>[0]);
    }
  }

  goto(payload: { region: string, start: number, end: number }) {

  }

  /**
   * TODO:
   * - genome id
   * - region name
   * - programs should be registered through events
   * - a program should be asynchronous 
   */

}

export type GenomeBrowser = InstanceType<typeof ToyGB>;
