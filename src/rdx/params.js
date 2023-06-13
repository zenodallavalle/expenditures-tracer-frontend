import { createSelector, createSlice } from '@reduxjs/toolkit';

import { getCurrentMonth } from 'utils';

import { loadInitialParametersSyncWithLocalStorage } from './paramsSyncWithLocalStorage';
import {
  loadInitialParametersReadFromURL,
  readFromURLParams,
} from './paramsReadFromURL';

export const initialSearchParams = {
  queryString: undefined,
  from: undefined,
  to: undefined,
  lowerPrice: undefined,
  upperPrice: undefined,
  type: undefined,
};

export const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    ...loadInitialParametersSyncWithLocalStorage(),
    ...loadInitialParametersReadFromURL(),
    searchParams: {
      ...initialSearchParams,
    },
    userSearchParams: { queryString: undefined },
  },
  reducers: {
    changedPanel: (state, { payload: panel }) => {
      state.panel = panel;
    },

    updatedAuthToken: (state, { payload: token }) => {
      state.authToken = token;
    },

    deletedAuthToken: (state) => {
      state.authToken = null;
    },

    updatedWorkingDBId: (state, { payload: id }) => {
      state.workingDBId = id;
    },

    deletedWorkingDBId: (state) => {
      state.workingDBId = null;
    },

    updatedWorkingMonth: (state, { payload: workingMonth }) => {
      state.workingMonth = workingMonth;
    },

    resetWorkingMonth: (state, action) => {
      state.workingMonth = getCurrentMonth();
    },

    updatedCategoryViewStatus: (
      state,
      { payload: { id, categoryViewStatus } }
    ) => {
      state.categoriesViewStatus[id] = categoryViewStatus;
    },

    resetCategoryViewStatus: (state, { payload: categoriesToResetIds }) => {
      categoriesToResetIds.forEach(
        (catId) => delete state.categoriesViewStatus[catId]
      );
    },

    changedSearchParams: (state, { payload: patch }) => {
      state.searchParams = Object.assign(state.searchParams, patch);
    },

    resetSearchParamsButQueryString: (state, action) => {
      state.searchParams = {
        ...initialSearchParams,
        queryString: state.searchParams.queryString,
      };
    },

    changedUserSearchParams: (state, { payload: patch }) => {
      state.userSearchParams = Object.assign(state.userSearchParams, patch);
    },

    changedBalanceChartPeriod: (state, { payload: period }) => {
      state.balanceChartPeriod = period;
    },

    resetBalanceChartPeriod: (state, action) => {
      state.balanceChartPeriod = '1Y';
    },

    changedBalanceChartType: (state, { payload: type }) => {
      state.balanceChartType = type;
    },

    resetBalanceChartType: (state, action) => {
      state.balanceChartType = 'multiple';
    },

    changedBalanceChartPercentage: (state, { payload: value }) => {
      state.selectBalanceChartPercentage = value;
    },

    resetBalanceChartPercentage: (state, action) => {
      state.selectBalanceChartPercentage = false;
    },
  },
});

export const selectAuthToken = (state) => state.params.authToken;
export const selectWorkingDBId = (state) => state.params.workingDBId;
export const selectWorkingMonth = (state) => state.params.workingMonth;
export const selectPanel = (state) => state.params.panel;
export const selectCategoriesViewStatus = (state) =>
  state.params.categoriesViewStatus;
export const selectCategoriesViewOrder = (state) =>
  state.params.categoriesViewOrder;

export const selectCategoryViewStatus = (id) => (state) =>
  state.params.categoriesViewStatus[id];
export const selectCategoryViewOrder = (id) => (state) =>
  state.params.categoriesViewOrder[id];

export const selectHiddenCategoriesIds = createSelector(
  (state) => state.params.categoriesViewStatus,
  (categoriesViewStatus) =>
    Object.entries(categoriesViewStatus)
      .filter(([, v]) => v === 'hidden')
      .map(([k]) => {
        const parsedK = parseInt(k);
        return isNaN(parsedK) ? k : parsedK;
      })
);

export const selectSearchParams = (state) => state.params.searchParams;

export const selectUserSearchParams = (state) => state.params.userSearchParams;

export const selectBalanceChartPeriod = (state) =>
  state.params.balanceChartPeriod;

export const selectBalanceChartType = (state) => state.params.balanceChartType;

export const selectBalanceChartPercentage = (state) =>
  state.params.selectBalanceChartPercentage;

const readFromURLParamsSelectors = readFromURLParams.map(
  (k) => (state) => state.params[k]
);

export const selectParamsToSaveInURL = createSelector(
  readFromURLParamsSelectors,
  (...values) =>
    Object.fromEntries(
      values.map((value, index) => [readFromURLParams[index], value])
    )
);

export const {
  changedPanel,
  updatedAuthToken,
  deletedAuthToken,
  updatedWorkingDBId,
  deletedWorkingDBId,
  updatedWorkingMonth,
  resetWorkingMonth,
  updatedCategoryViewStatus,
  resetCategoryViewStatus,
  changedSearchParams,
  resetSearchParamsButQueryString,
  changedUserSearchParams,
  changedBalanceChartPeriod,
  resetBalanceChartPeriod,
  changedBalanceChartType,
  resetBalanceChartType,
  changedBalanceChartPercentage,
  resetBalanceChartPercentage,
} = paramsSlice.actions;

export default paramsSlice.reducer;
