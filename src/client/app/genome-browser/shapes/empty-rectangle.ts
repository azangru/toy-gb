class EmptyRectangle {
  type = 'empty-rectangle';

  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;

  constructor(params: {
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
  }) {
    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.height = params.height;
    this.strokeColor = params.strokeColor;
  }
}

export default EmptyRectangle;

export type EmptyRectangleInstance = InstanceType<typeof EmptyRectangle>;
