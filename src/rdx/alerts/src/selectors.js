const selectors = {
  getAll: () => (s) => s.alerts.alerts,
  getById: (id) => (s) => s.alerts.alerts.find((a) => a.id === id),
};

export default selectors;
