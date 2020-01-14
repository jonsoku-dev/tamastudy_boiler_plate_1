const mediaQuery = (num: number) => {
  const breakpoints = [576, 768, 992, 1200];
  const mq = breakpoints.map(bp => `@media (min-width: ${bp}px)`);
  return mq[num];
};

export default mediaQuery;
