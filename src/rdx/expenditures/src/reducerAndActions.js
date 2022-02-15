import { createSlice } from '@reduxjs/toolkit';

const analyzePayload = (db) => {
  const entities = {};
  db.categories.forEach((cat) => {
    cat.expected_expenditures.forEach((e) => {
      entities[e.id] = e;
    });
    cat.actual_expenditures.forEach((e) => {
      entities[e.id] = e;
    });
  });
  return { entities };
};

const initialState = {
  status: 'initial',
  content: {},
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
      state.content = {};
    },
    dataRetrieved: (state, action) => {
      state.status = 'idle';
      const { entities } = analyzePayload(action.payload);
      state.content = { ...state.content, ...entities };
    },
    expenditureRetrieved: (state, action) => {
      state.status = 'idle';
      state.content[action.payload.id] = action.payload;
    },
    expendituresRetrieved: (state, action) => {
      state.status = 'idle';
      action.payload.forEach((exp) => {
        state.content[exp.id] = exp;
      });
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
