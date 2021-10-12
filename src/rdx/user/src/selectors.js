const selectors = {
  user: () => (s) => s.user.content,
  status: () => (s) => s.user.status,
  error: () => (s) => s.user.error,
  isLoading:
    (includeInitial = true) =>
    (s) =>
      includeInitial
        ? ['loading', 'initial'].includes(s.user.status)
        : s.user.status === 'loading',
  isInitial: () => (s) => s.user.status === 'initial',
  isAvailableForRequests: (type) => (s) =>
    ['idle', 'initial'].includes(s.user.status),
  isAuthenticated: () => (s) => Boolean(s.user.content),
  getDBById: (id) => (s) => s.user.content?.dbs.find((db) => db.id === id),
  countDBS: () => (s) => s.user.content?.dbs.length,
};

export default selectors;
