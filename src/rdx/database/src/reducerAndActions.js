import { createSlice } from '@reduxjs/toolkit';

const analyzePayload = (db) => {
  const incomes = [...db.incomes];
  const categories = [...db.categories];
  const categoriesIds = [];
  const categoriesEntities = {};
  const incomesIds = incomes.map((i) => i.id);
  const incomesEntities = incomes.reduce(
    (acc, i) => ({ ...acc, [i.id]: i }),
    {}
  );
  categories.forEach((cat) => {
    const category = {
      ...cat,
      expected_expenditures: cat.expected_expenditures.map((e) => e.id),
      actual_expenditures: cat.actual_expenditures.map((e) => e.id),
    };
    categoriesIds.push(cat.id);
    categoriesEntities[cat.id] = category;
  });
  return {
    ...db,
    incomes: { ids: incomesIds, entities: incomesEntities },
    categories: { ids: categoriesIds, entities: categoriesEntities },
  };
};

const initialState = {
  status: 'initial',
  content: null,
  error: null,
};

const slice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    error: (state, action) => {
      state.error = action.payload;
    },
    isLoading: (state, action) => {
      state.status = 'loading';
    },
    loaded: (state, action) => {
      state.status = 'idle';
    },
    dataErased: (state, action) => {
      state.status = 'idle';
      state.content = null;
    },
    dataRetrieved: (state, action) => {
      state.status = 'idle';
      state.content = analyzePayload(action.payload);
    },
    dataUpdated: (state, action) => {
      state.status = 'idle';
      state.content = analyzePayload(action.payload);
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
