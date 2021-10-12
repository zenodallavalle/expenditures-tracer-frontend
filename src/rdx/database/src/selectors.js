const selectors = {
  content: () => (s) => s.database.content,
  status: () => (s) => s.database.status,
  error: () => (s) => s.database.error,
  isLoading:
    (includeInitial = true) =>
    (s) =>
      includeInitial
        ? ['loading', 'initial'].includes(s.database.status)
        : s.database.status === 'loading',
  getWorkingDB: () => (s) => s.database.content, // alias for content
  getWorkingMonth: () => (s) =>
    s.database.content?.months_list.find((m) => m.is_working)?.month,
  getProspect: () => (s) => s.database.content?.prospect,
  isInitial: () => (s) => s.database.status === 'initial',
  isAvailableForRequests: () => (s) =>
    ['idle', 'initial'].includes(s.database.status),
  getActualMoney: () => (s) => s.database.content?.actual_money,
  getIncomesIds: () => (s) => s.database.content?.incomes.ids,
  getIncomesByIds: (ids) => (s) =>
    ids.map((id) => s.database.content?.incomes.entities[id]),
  getIncomeById: (id) => (s) => s.database.content?.incomes.entities[id],
  getCategoriesIds: () => (s) => s.database.content?.categories.ids,
  getCategoryById: (id) => (s) => s.database.content?.categories.entities[id],
  getCategoriesByIds: (ids) => (s) =>
    ids.map((id) => s.database.content?.categories.entities[id]),
  getCategories: () => (s) =>
    s.database.content?.categories.ids &&
    Object.values(s.database.content?.categories.entities),
  getMonths: () => (s) => s.database.content?.months_list,
};

export default selectors;
