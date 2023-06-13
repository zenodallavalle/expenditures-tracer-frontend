export const getGraphHeight = () => {
  const { innerWidth } = window;
  let breakpoint = parseInt(process.env.REACT_APP_WIDTH_GRAPHBREAKPOINT);
  if (isNaN(breakpoint)) {
    breakpoint = 768;
  }
  if (innerWidth < breakpoint) {
    let ret = parseInt(process.env.REACT_APP_GRAPH_HEIGHT_IF_BROKEN);
    if (isNaN(ret)) {
      ret = 300;
    }
    return ret;
  }
  return null;
};
