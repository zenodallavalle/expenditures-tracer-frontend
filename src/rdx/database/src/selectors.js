const selectors = {};

selectors.content = () => (s) => s.database.content;
selectors.status = () => (s) => s.database.status;
selectors.error = () => (s) => s.database.error;
selectors.isLoading =
  (includeInitial = true) =>
  (s) => {
    if (includeInitial) {
      return ['loading', 'initial'].includes(s.database.status);
    } else {
      return s.database.status === 'loading';
    }
  };
selectors.getWorkingDB = () => (s) => s.database.content; // alias for content
selectors.getWorkingMonth = () => (s) =>
  s.database.content?.months_list.find((m) => m.is_working)?.month;
selectors.getProspect = () => (s) => s.database.content?.prospect;
selectors.isInitial = () => (s) => s.database.status === 'initial';
selectors.isAvailableForRequests = () => (s) =>
  ['idle', 'initial'].includes(s.database.status);
selectors.getActualMoney = () => (s) => s.database.content?.actual_money;
selectors.getIncomesIds = () => (s) => s.database.content?.incomes.ids;
selectors.getIncomesByIds = (ids) => (s) =>
  ids.map((id) => s.database.content?.incomes.entities[id]);
selectors.getIncomeById = (id) => (s) =>
  s.database.content?.incomes.entities[id];
selectors.getCategoriesIds = () => (s) => s.database.content?.categories.ids;
selectors.getHiddenCategoriesIds = () => (s) =>
  s.database.content?.categories.ids &&
  s.database.content.categories.ids.filter(
    (id) => s.database.content.categories.entities[id].status === 'hidden'
  );
selectors.getNotHiddenCategoriesIds = () => (s) =>
  s.database.content?.categories.ids &&
  s.database.content.categories.ids.filter(
    (id) => s.database.content.categories.entities[id].status !== 'hidden'
  );
selectors.getCategoryById = (id) => (s) =>
  s.database.content?.categories.entities[id];
selectors.getCategoriesByIds = (ids) => (s) =>
  ids.map((id) => selectors.getCategoryById(id)(s));
selectors.getCategories = () => (s) =>
  s.database.content?.categories.ids &&
  s.database.content?.categories.ids.map((id) =>
    selectors.getCategoryById(id)(s)
  );
selectors.getHiddenCategories = () => (s) =>
  s.database.content?.categories.ids &&
  selectors
    .getHiddenCategoriesIds()(s)
    .map((id) => selectors.getCategoryById(id)(s));
selectors.getNotHiddenCategories = () => (s) =>
  s.database.content?.categories.ids &&
  selectors
    .getNotHiddenCategoriesIds()(s)
    .map((id) => selectors.getCategoryById(id)(s));

selectors.getExpendituresIdsByCategory = (cateogoryId, expected) => (s) => {
  return expected
    ? s.database.content?.categories.entities[cateogoryId].expected_expenditures
    : s.database.content?.categories.entities[cateogoryId].actual_expenditures;
};
selectors.getExpendituresIds = (expected) => (s) => {
  const ids = [];
  if (s.database.content?.categories?.ids) {
    expected
      ? ids.push(
          ...Object.values(s.database.content.categories.entities).reduce(
            (acc, cat) => [...acc, ...cat.expected_expenditures],
            ids
          )
        )
      : ids.push(
          ...Object.values(s.database.content.categories.entities).reduce(
            (acc, cat) => [...acc, ...cat.expected_expenditures],
            ids
          )
        );
  }
  return ids;
};
selectors.getExpenditures = (expected) => (s) => {
  const ids = selectors.getExpendituresIds(expected)(s);
  return ids.map((id) => s.expenditures.content[id]);
};

selectors.getMonths = () => (s) => s.database.content?.months_list;

export default selectors;
