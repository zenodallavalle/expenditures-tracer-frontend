import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'initial',
  content: null,
  error: null,
  parameters: {
    queryString: '',
    from: '',
    to: '',
    lowerPrice: '',
    upperPrice: '',
    type: 'both',
  },
};

const slice = createSlice({
  name: 'search',
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
      state.status = 'initial';
      state.content = null;
    },
    dataRetrieved: (state, action) => {
      state.status = 'idle';
      state.content = action.payload.map((exp) => exp.id);
    },
    nextPageLoaded: (state, action) => {
      state.status = 'idle';
      state.content = [
        ...state.content,
        ...action.payload.map((exp) => exp.id),
      ];
    },
    parameterReset: (state, action) => {
      state.parameters[action.payload] =
        initialState.parameters[action.payload];
    },
    advancedParametersReset: (state, payload) => {
      const queryString = state.parameters.queryString;
      state.parameters = { ...initialState.parameters, queryString };
    },
    parametersChanged: (state, action) => {
      Object.entries(action.payload).forEach(([k, v]) => {
        state.parameters[k] = v;
      });
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
