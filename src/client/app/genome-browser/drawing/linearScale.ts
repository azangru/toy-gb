type Params = {
  domain: [number, number],
  range: [number, number]
}

const getLinearScale = (params: Params) => {
  const { domain, range } = params;
  const [ domainStart, domainEnd ] = domain;
  const [ rangeStart, rangeEnd ] = range;
  const domainInterval = domainEnd - domainStart;
  const rangeInterval = rangeEnd - rangeStart;

  const coefficient = rangeInterval / domainInterval;

  return (numberFromDomain: number) => {
    return Math.floor(numberFromDomain * coefficient);
  }
};

export type LinearScale = ReturnType<typeof getLinearScale>;

export default getLinearScale;
