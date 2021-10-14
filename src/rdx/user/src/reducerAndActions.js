import { createSlice } from '@reduxjs/toolkit';

import userApi from 'api/userApi';

console.log(userApi);

const initialState = {
  status: 'initial',
  content: null,
  error: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    isLoading: (state, action) => {
      state.status = 'loading';
    },
    dbAdded: (state, action) => {
      const addedDB = action.payload;
      state.status = 'idle';
      state.content.dbs = [...state.content.dbs, addedDB];
    },
    dbUpdated: (state, action) => {
      const updatedDB = action.payload;
      state.status = 'idle';
      state.content.dbs = state.content.dbs.map((db) =>
        db.id !== updatedDB.id ? db : updatedDB
      );
    },
    dbDeleted: (state, action) => {
      const deletedDB = action.payload;
      state.status = 'idle';
      state.content.dbs = state.content.dbs.filter(
        (db) => db.id !== deletedDB.id
      );
    },
  },
  extraReducers: (builder) => {
    //tryAuthLogin
    builder.addCase(userApi.tryAuthToken.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(userApi.tryAuthToken.fulfilled, (state, action) => {
      state.status = 'idle';
      state.content = action.payload;
    });
    builder.addCase(userApi.tryAuthToken.rejected, (state, action) => {
      if (action.meta.condition) {
        // authToken was not found in storage
        state.status = 'idle';
        state.content = null;
      } else if (!action.meta.response) {
        state.status = 'error';
        const { error } = action;
        state.error = error.message;
      } else {
        state.status = 'idle';
        state.content = null;
      }
    });

    //login
    builder.addCase(userApi.login.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(userApi.login.fulfilled, (state, action) => {
      state.status = 'idle';
      state.content = action.payload;
    });
    builder.addCase(userApi.login.rejected, (state, action) => {
      if (action.meta.response) {
        state.status = 'idle';
      } else {
        state.status = 'error';
        const { error } = action;
        state.error = error.message;
      }
    });

    //logout
    builder.addCase(userApi.logout.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(userApi.logout.fulfilled, (state, action) => {
      state.status = 'idle';
      state.content = null;
    });
  },
});

export const { actions } = slice;

export default slice.reducer;
