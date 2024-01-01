class SolidRectangle {
  type = 'solid-rectangle';

  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(params: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }) {
    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.height = params.height;
    this.color = params.color;
  }
}

export default SolidRectangle;

export type SolidRectangleInstance = InstanceType<typeof SolidRectangle>;
