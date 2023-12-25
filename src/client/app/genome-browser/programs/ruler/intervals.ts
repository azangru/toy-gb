export const calculateRulerInterval = ({ startBp, endBp }: { startBp: number, endBp: number }) => {
  const range = endBp - startBp;

  let multiplier = 1;
  let shouldContinue = true;

  while (shouldContinue) {
    if (multiplier * 10 < range) {
      multiplier *= 10;
    } else {
      shouldContinue = false
    }
  }

  const step = [
    multiplier,
    multiplier / 2,
    multiplier / 5,
    multiplier / 10
  ].filter(num => range / num <= 10)
  .pop() ?? 1; // the "?? 1" is just to make typescript happy

  return {
    unit: multiplier,
    step
  };
};

export const getRulerTicks = (params: { startBp: number, endBp: number }) => {
  const { startBp, endBp } = params;
  const { step } = calculateRulerInterval(params);

  const offset = startBp % step;

  const tickBefore = startBp - offset;

  const ticks: number[] = [];

  let shouldAddTick = true;

  while (shouldAddTick) {
    const nextTick = (ticks.at(-1) ?? tickBefore) + step;
    if (nextTick < endBp) {
      ticks.push(nextTick);
    } else {
      shouldAddTick = false;
    }
  }

  return ticks;
};
