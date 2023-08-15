console.log('hey?');

const container = document.querySelector('#app') as HTMLElement;

const canvasElement = document.createElement('canvas');
canvasElement.width = 1000;
canvasElement.height = 1000;
const context = canvasElement.getContext('2d') as CanvasRenderingContext2D;
context.rect(10, 20, 150, 100);
context.fill();

container.appendChild(canvasElement)
