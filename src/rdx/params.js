import { createSlice } from '@reduxjs/toolkit';

import { getCurrentMonth, getCurrentPanel } from 'utils';

export const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    panel: getCurrentPanel(),
    authToken: localStorage.getItem('authToken'),
    workingDBId: localStorage.getItem('workingDBId'),
    workingMonth: getCurrentMonth(),
  },
  reducers: {
    changedPanel: {
      reducer: (state, action) => {
        const { payload: panel } = action;
        state.panel = panel;
      },
      prepare: (panel) => {
        // update url querystring
        // const urlSearchParams = new URLSearchParams(window.location.search);
        // urlSearchParams.set('panel', panel);
        // navigate(`/?${urlSearchParams.toString()}`);
        return { payload: panel };
      },
    },
    updatedAuthToken: {
      reducer: (state, action) => {
        const { payload: token } = action;
        state.authToken = token;
      },
      prepare: (token) => {
        localStorage.setItem('authToken', token);
        return { payload: token };
      },
    },
    deletedAuthToken: {
      reducer: (state) => {
        state.authToken = null;
      },
      prepare: () => {
        localStorage.removeItem('authToken');
        return { payload: null };
      },
    },
    updatedWorkingDBId: {
      reducer: (state, action) => {
        const { payload: id } = action;
        state.workingDBId = id;
      },
      prepare: (id) => {
        localStorage.setItem('workingDBId', id);
        return { payload: id };
      },
    },
    deletedWorkingDBId: {
      reducer: (state) => {
        state.workingDBId = null;
      },
      prepare: () => {
        localStorage.removeItem('workingDBId');
        return { payload: null };
      },
    },
    updatedWorkingMonth: (state, action) => {
      const { payload: workingMonth } = action;
      state.workingMonth = workingMonth;
    },
    resetWorkingMonth: (state, action) => {
      state.workingMonth = getCurrentMonth();
    },
  },
});

export const selectAuthToken = (state) => state.params.authToken;
export const selectWorkingDBId = (state) => state.params.workingDBId;
export const selectWorkingMonth = (state) => state.params.workingMonth;
export const selectPanel = (state) => state.params.panel;

export const {
  changedPanel,
  updatedAuthToken,
  deletedAuthToken,
  updatedWorkingDBId,
  deletedWorkingDBId,
  updatedWorkingMonth,
  resetWorkingMonth,
} = paramsSlice.actions;

export default paramsSlice.reducer;
