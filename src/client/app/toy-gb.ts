class ToyGB extends HTMLElement {
  constructor() {
    super();
    // receive configuration?

    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.innerHTML = styles;
  }

  createCanvas() {
    const { width, height } = this.getBoundingClientRect();
    const canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    const context = canvasElement.getContext('2d') as CanvasRenderingContext2D;
    context.rect(10, 20, 150, 100);
    context.fill();

    return canvasElement;
  }

  connectedCallback() {
    const canvas = this.createCanvas();
    this.shadowRoot?.appendChild(canvas);
  }
}

const styles = `
<style>

:host {
  display: block;
  font-size: 0;
}

* {
  box-sizing: border-box;
}

canvas {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}

</style>
`;

window.customElements.define('toy-gb', ToyGB);
