import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'initial',
  content: { entitis: {}, ids: [] },
  error: null,
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    isLoading: (state, action) => {
      state.status = 'loading';
    },
    instanceRetrieved: (state, action) => {
      state.status = 'idle';
      state.content.ids.push(action.payload.id);
      state.content.entitis[action.payload.id] = { ...action.payload };
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
