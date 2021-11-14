import { createSlice } from '@reduxjs/toolkit';

import { mergeOrder, saveOrder } from './categoryOrder';
import { getStatus, saveStatus } from './categoryStatus';

const analyzePayload = (db) => {
  const incomes = [...db.incomes];
  const categories = [...db.categories];
  let categoriesIds = [];
  const categoriesEntities = {};
  const incomesIds = incomes.map((i) => i.id);
  const incomesEntities = incomes.reduce(
    (acc, i) => ({ ...acc, [i.id]: i }),
    {}
  );

  const state = getStatus();

  categories.forEach((cat) => {
    const category = {
      ...cat,
      expected_expenditures: cat.expected_expenditures.map((e) => e.id),
      actual_expenditures: cat.actual_expenditures.map((e) => e.id),
    };
    categoriesIds.push(cat.id);
    categoriesEntities[cat.id] = { ...category, status: state[cat.id] };
  });

  categoriesIds = mergeOrder(categoriesIds);
  saveOrder(categoriesIds);

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
    updateCategoryState: (state, action) => {
      saveStatus(action.payload.id, action.payload.status);
      const categoriesEntities = state.content.categories.entities;
      state.content.categories.entities = {
        ...categoriesEntities,
        [action.payload.id]: {
          ...categoriesEntities[action.payload.id],
          status: action.payload.status,
        },
      };
    },
    expandHiddenCategories: (state, action) => {
      const categoriesIds = state.content?.categories.ids;
      const categories = {};
      categoriesIds.forEach((id) => {
        saveStatus(id, 'expanded');
        categories[id] = {
          ...state.content?.categories.entities[id],
          status: 'expanded',
        };
      });
      state.content.categories.entities = categories;
    },
    alterOrder: (state, action) => {
      const categoriesIds = state.content?.categories.ids;
      const index = categoriesIds.indexOf(action.payload.id);
      if (index + action.payload.relativeDelta >= 0) {
        const categoryId = categoriesIds[index];
        categoriesIds.splice(index, 1);
        categoriesIds.splice(
          index + action.payload.relativeDelta,
          0,
          categoryId
        );
        state.content.categories.ids = categoriesIds;
        saveOrder(categoriesIds);
      }
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
