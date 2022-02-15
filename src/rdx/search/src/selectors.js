const selectors = {
  getIds: () => (s) => s.search.content,
  status: () => (s) => s.search.status,
  error: () => (s) => s.search.error,
  getQueryString: () => (s) => s.search.parameters.queryString,
  getQueryParameters: () => (s) => s.search.parameters,
  isLoading:
    (includeInitial = true) =>
    (s) =>
      includeInitial
        ? ['loading', 'initial'].includes(s.search.status)
        : s.search.status === 'loading',
  isInitial: () => (s) => s.search.status === 'initial',
  isAvailableForRequests: () => (s) =>
    ['idle', 'initial'].includes(s.search.status),
};

export default selectors;
