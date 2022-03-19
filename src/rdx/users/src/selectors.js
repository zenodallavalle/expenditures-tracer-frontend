const selectors = {
  getById: (id) => (s) =>
    id && s.user.content?.id === id
      ? s.user.content
      : s.users.content.entities[id],
  getByIds: (ids) => (s) =>
    ids.map((id) =>
      id && s.user.content?.id === id
        ? s.user.content
        : s.users.content.entities[id]
    ),
  getIds: () => (s) => s.users.content.ids,
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
