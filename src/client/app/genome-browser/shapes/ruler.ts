class Ruler {
  type = 'ruler';
  ticks: number[];

  constructor(ticks: number[]) {
    this.ticks = ticks;
  }
}

export default Ruler;

export type RulerInstance = InstanceType<typeof Ruler>;
