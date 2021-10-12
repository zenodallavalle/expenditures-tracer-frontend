const selectors = {
  getAll: (expected) => (s) =>
    s.expenditures.content
      ? Object.values(s.expenditures.content.entities).filter((exp) => {
          if (expected === undefined) return true;
          else return exp.is_expected === expected;
        })
      : [],
  getIds: (expected) => (s) =>
    Object.values(s.expenditures.content?.entities)
      ?.filter((exp) => {
        if (expected === undefined) return true;
        else return exp.is_expected === expected;
      })
      .map((e) => e.id),
  getIdsByCategory: (categoryId, expected) => (s) =>
    Object.values(s.expenditures.content?.entities)
      ?.filter(
        (exp) => exp.category === categoryId && exp.is_expected === expected
      )
      .map((e) => e.id),
  getById: (id) => (s) => s.expenditures.content?.entities[id],
  getByIds: (ids) => (s) =>
    ids.map((id) => s.expenditures.content?.entities[id]),

  status: () => (s) => s.expenditures.status,
  error: () => (s) => s.expenditures.error,
  isLoading:
    (includeInitial = true) =>
    (s) =>
      includeInitial
        ? ['loading', 'initial'].includes(s.expenditures.status)
        : s.expenditures.status === 'loading',
  isInitial: () => (s) => s.expenditures.status === 'initial',
  isAvailableForRequests: () => (s) =>
    ['idle', 'initial'].includes(s.expenditures.status),
};

export default selectors;
