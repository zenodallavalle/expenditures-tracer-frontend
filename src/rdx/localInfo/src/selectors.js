const selectors = {
  getCurrentPanel: () => (s) => s.localInfo.panel.current,
  getPreviousPanel: () => (s) => s.localInfo.panel.previous,
  getWorkingMonth: () => (s) => s.localInfo.workingMonth,
};

export default selectors;
