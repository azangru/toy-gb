class Line {
  type = 'line';

  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  thickness: number;
  color: string;

  constructor(params: {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    thickness?: number;
    color: string;
  }) {
    this.xStart = params.xStart;
    this.yStart = params.yStart;
    this.xEnd = params.xEnd;
    this.yEnd = params.yEnd;
    this.thickness = params.thickness ?? 1;
    this.color = params.color;
  }
}

export default Line;

export type LineInstance = InstanceType<typeof Line>;
