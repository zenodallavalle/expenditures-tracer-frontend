import { createSlice } from '@reduxjs/toolkit';

import { userApi } from 'api';

const initialState = {
  status: 'initial',
  content: { entities: {}, ids: [] },
  error: null,
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    //getByIds
    builder.addCase(userApi.getByIds.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(userApi.getByIds.fulfilled, (state, action) => {
      state.status = 'idle';
      action.payload.results.forEach((user) => {
        const { id } = user;
        !state.content.entities[id] && state.content.ids.push(id);
        state.content.entities[id] = user;
      });
    });
    builder.addCase(userApi.getByIds.rejected, (state, action) => {
      if (!action.meta.response) {
        state.status = 'error';
        const { error } = action;
        state.error = error.message;
      } else {
        state.status = 'idle';
      }
    });

    //search
    builder.addCase(userApi.search.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(userApi.search.fulfilled, (state, action) => {
      state.status = 'idle';
      action.payload.results.forEach((user) => {
        const { id } = user;
        !state.content.entities[id] && state.content.ids.push(id);
        state.content.entities[id] = user;
      });
    });
    builder.addCase(userApi.search.rejected, (state, action) => {
      if (!action.meta.response) {
        state.status = 'error';
        const { error } = action;
        state.error = error.message;
      } else {
        state.status = 'idle';
      }
    });
  },
});

export const { actions } = slice;

export default slice.reducer;
