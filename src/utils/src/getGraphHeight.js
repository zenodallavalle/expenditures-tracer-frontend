export const getGraphHeight = () => {
  const { innerWidth } = window;
  let breakpoint = parseInt(import.meta.env.VITE_WIDTH_GRAPHBREAKPOINT);
  if (isNaN(breakpoint)) {
    breakpoint = 768;
  }
  if (innerWidth < breakpoint) {
    let ret = parseInt(import.meta.env.VITE_GRAPH_HEIGHT_IF_BROKEN);
    if (isNaN(ret)) {
      ret = 300;
    }
    return ret;
  }
  return null;
};
