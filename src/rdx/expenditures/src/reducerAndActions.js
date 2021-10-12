import { createSlice } from '@reduxjs/toolkit';

const analyzePayload = (db) => {
  const ids = [];
  const entities = {};
  db.categories.forEach((cat) => {
    cat.expected_expenditures.forEach((e) => {
      ids.push(e.id);
      entities[e.id] = e;
    });
    cat.actual_expenditures.forEach((e) => {
      ids.push(e.id);
      entities[e.id] = e;
    });
  });
  return { ids, entities };
};

const initialState = {
  status: 'initial',
  content: null,
  error: null,
};

const slice = createSlice({
  name: 'expenditures',
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
    expenditureRetrieved: (state, action) => {
      state.status = 'idle';
      state.content.ids.push(action.payload.id);
      state.content.entities[action.payload.id] = action.payload;
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
