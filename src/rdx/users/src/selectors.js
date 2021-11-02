const selectors = {
  getById: (id) => (s) => id && s.users.content.entities[id],
  status: () => (s) => s.users.status,
  error: () => (s) => s.users.error,
  isLoading:
    (includeInitial = true) =>
    (s) =>
      includeInitial
        ? ['loading', 'initial'].includes(s.users.status)
        : s.users.status === 'loading',
  isInitial: () => (s) => s.users.status === 'initial',
  isAvailableForRequests: (type) => (s) =>
    ['idle', 'initial'].includes(s.users.status),
};

export default selectors;
