import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import ViewportController from './genome-browser/controllers/viewport-controller';

import Painter from './genome-browser/drawing';

import rulerProgram from './genome-browser/programs/ruler';

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

  viewport = {
    start: 2750000,
    end: 2751005
  };

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

  rerender() {
    this.clearCanvas();
    this.executePrograms();
  }

  clearCanvas() {
    const canvasContext = this.getCanvasContext();
    canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // public method for consumers of this element to send commands to it 
  send(message: { type: string, payload: unknown }) {
    if (message.type === 'goto') {
      this.goto(message.payload as Parameters<typeof this.goto>[0]);
    }
  }

  goto(payload: { region: string, start: number, end: number }) {

  }

  executePrograms() {
    // this should be dynamically generated based on passed settings
    const programs = [
      rulerProgram
    ];

    const viewport = this.viewportController.viewport ?? this.viewport;

    const shapes = programs.flatMap(program => program({ viewport }));

    this.painter.setShapes(shapes);
    this.painter.paint({ viewport });
  }

}

export type GenomeBrowser = InstanceType<typeof ToyGB>;
