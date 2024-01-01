import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import ViewportController from './genome-browser/controllers/viewport-controller';

import Painter from './genome-browser/drawing';

import rulerProgram from './genome-browser/programs/ruler';
import { geneProgram } from './genome-browser/programs/genes';

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

  // canvasContext: CanvasRenderingContext2D;
  painter!: Painter;

  // viewport = {
  //   start: 2750000,
  //   end: 2751005
  // };
  // viewport = {
  //   start: 1,
  //   end: 35181319
  // }
  viewport = {
    start: 27000000,
    end: 27100000
  }

  genome_id: string = 'a7335667-93e7-11ec-a39d-005056b38ce3';
  region_name: string = '13';

  viewportController = new ViewportController(this, this.viewport);


  // constructor() {
  //   super();
  //   // const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
  //   // root.innerHTML = `
  //   //   ${styles}
  //   //   <canvas></canvas>
  //   // `;
  // }

  firstUpdated() {
    this.initialiseCanvas();
    this.painter = new Painter(this.canvas);
    this.viewportController.registerCanvas(this.canvas);
    // this.addListeners();


    // NOTE: this would have to be moved somewhere
    this.executePrograms();
  }

  updated() {
    this.rerender();
  }

  initialiseCanvas() {
    if (!this.canvas) {
      return;
    }
    const { width, height } = this.getBoundingClientRect();
    const { devicePixelRatio } = window;
    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;
    const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    context.scale(devicePixelRatio, devicePixelRatio);
    // this.canvasContext = context;
    // return canvasElement;
  }

  addListeners() {
    this.canvas.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      const { start, end } = this.viewport;
      const viewportRange = end - start;
      const step = Math.round(0.01 * Math.abs(event.deltaY) * viewportRange);

      let newStart: number, newEnd: number;

      // wheel up means zoom out; wheel down means zoom in
      if (event.deltaY < 0) {
        newStart = Math.min(
          start + step,
          end
        );
        newEnd = Math.max(
          end - step,
          start
        ); 
      } else {
        newStart = Math.max(
          start - step,
          1
        );
        newEnd = end + step;
      }

      this.viewport = { start: newStart, end: newEnd };

      this.rerender();
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const resizeObserverEntry = entries[0];
      const { width, height } = resizeObserverEntry.contentRect;
      const { devicePixelRatio } = window;
      this.canvas.width = width * devicePixelRatio;
      this.canvas.height = height * devicePixelRatio;
      const canvasContext = this.getCanvasContext();
      canvasContext.scale(devicePixelRatio, devicePixelRatio);
      this.rerender();
    });
    resizeObserver.observe(this.canvas);
  }

  getCanvasContext() {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  render() {
    return html`
      <canvas></canvas>
    `;
  }

  // hypothetically, this should be a queue: if you didn't have time to fit in a frame, you should skip a frame 
  rerender() {
    requestAnimationFrame(() => {
      this.clearCanvas();
      this.executePrograms();
    });
  }

  clearCanvas() {
    const canvasContext = this.getCanvasContext();
    canvasContext.reset();

    // this should be in its own function, to run after the reset
    const { devicePixelRatio } = window;
    canvasContext.scale(devicePixelRatio, devicePixelRatio);
  }

  // public method for consumers of this element to send commands to it 
  send(message: { type: string, payload: unknown }) {
    if (message.type === 'goto') {
      this.goto(message.payload as Parameters<typeof this.goto>[0]);
    }
  }

  goto(payload: { region: string, start: number, end: number }) {

  }

  async executePrograms() {
    // this should be dynamically generated based on passed settings
    const programs = [
      rulerProgram,
      geneProgram
    ];

    /**
     * TODO:
     * - genome id
     * - region name
     * - programs should be registered through events
     * - a program should be asynchronous 
     */

    const viewport = this.viewportController.viewport ?? this.viewport;

    const shapePromises = programs.map(program => program({
      viewport,
      genome_id: 'human', // TODO: pass through properties
      region_name: '13' // TODO: pass through properties
    }));

    const shapes = await Promise.all(shapePromises).then(shapesArr => shapesArr.flat());

    this.painter.setShapes(shapes);
    this.painter.paint({ viewport });

    this.canvas.getContext('2d').fill(); // Apparently, the fill command is resource-intensive for the GPU and can't be run for every rectangle
  }

}

export type GenomeBrowser = InstanceType<typeof ToyGB>;
