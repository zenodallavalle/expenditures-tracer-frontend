import { configureStore } from '@reduxjs/toolkit';

import equal from 'deep-equal';

import { default as paramsReducer } from './params';
import { alertsReducer } from './alerts';
import { userApiSlice } from 'api/userApiSlice';

import {
  saveParamsInLocalStorage,
  syncedWithLocalSessionParams,
} from './paramsSyncWithLocalStorage';

const paramsSyncWithLocalStorageMiddleware = (store) => (next) => (action) => {
  const prevParams = store.getState().params;
  const result = next(action);
  const currentParams = store.getState().params;

  if (/params\//.test(action.type)) {
    const syncedPrevParams = Object.fromEntries(
      syncedWithLocalSessionParams.map((k) => [k, prevParams[k]])
    );
    const syncedCurrentParams = Object.fromEntries(
      syncedWithLocalSessionParams.map((k) => [k, currentParams[k]])
    );
    if (!equal(syncedPrevParams, syncedCurrentParams)) {
      saveParamsInLocalStorage(syncedCurrentParams);
    }
  }

  return result;
};

const newStore = () =>
  configureStore({
    reducer: {
      params: paramsReducer,
      alerts: alertsReducer,
      api: userApiSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(userApiSlice.middleware)
        .concat(paramsSyncWithLocalStorageMiddleware),
  });

const store = newStore();

export default store;
