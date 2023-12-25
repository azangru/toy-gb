import { ReactiveController, ReactiveControllerHost } from 'lit';

type Viewport = {
  start: number;
  end: number;
}

class ViewportController implements ReactiveController {

  host: ReactiveControllerHost;

  viewport: Viewport | null;
  canvas: HTMLCanvasElement | null;

  isMouseDown = false;
  isDragging = false;

  mouseDownX: number | null = null;
  mouseDownY: number | null = null;

  constructor(host: ReactiveControllerHost, viewport: Viewport) {
    this.host = host;
    host.addController(this);
    this.viewport = viewport;
  }

  hostDisconnected() {
    this.#removeListeners();
  }

  setViewport = (viewport: Viewport) => {
    this.viewport = viewport;
  }

  registerCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.#addListeners();
  }

  #addListeners = () => {
    this.canvas!.addEventListener('wheel', this.onWheel);
    this.canvas!.addEventListener('mousedown', this.onMouseDown);
  }

  #removeListeners = () => {
    this.canvas!.addEventListener('wheel', this.onWheel);
  }

  onWheel = (event: WheelEvent) => {
    if (!this.viewport) {
      return;
    }

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
    this.host.requestUpdate();
  }

  onMouseDown = (event: MouseEvent) => {
    this.isMouseDown = true;
    const canvas = event.currentTarget;
    const { clientX: x, clientY: y } = event;
    this.mouseDownX = x;
    this.mouseDownY = y;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    this.isDragging = true;

    const { clientX: x } = event;
    const deltaX = x - this.mouseDownX;
    this.mouseDownX = x;

    const { start, end } = this.viewport;
    const viewportRange = end - start;

    const canvasWidth = this.canvas.width;
    const fractionWidthTravelled = deltaX / canvasWidth;

    const newStart = start - Math.floor(viewportRange * fractionWidthTravelled);
    const newEnd = end - Math.floor(viewportRange * fractionWidthTravelled);

    this.viewport = { start: newStart, end: newEnd };
    this.host.requestUpdate();
  }

  onMouseUp = () => {
    this.isDragging = false;
    this.isMouseDown = false;

    document.removeEventListener('mousemove', this.onMouseMove);
  }


}

export default ViewportController;
