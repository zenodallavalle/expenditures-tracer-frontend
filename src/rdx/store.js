import { configureStore } from '@reduxjs/toolkit';

import paramsReducer from './params';
import { userReducer } from './user';
import { usersReducer } from './users';
import { databaseReducer } from './database';
import { expendituresReducer } from './expenditures';
import { alertsReducer } from './alerts';
import { searchReducer } from './search';
import { userApiSlice } from 'api/userApiSlice';

const newStore = () =>
  configureStore({
    reducer: {
      params: paramsReducer,
      alerts: alertsReducer,
      user: userReducer,
      users: usersReducer,
      database: databaseReducer,
      expenditures: expendituresReducer,
      search: searchReducer,
      api: userApiSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApiSlice.middleware),
  });

const store = newStore();

export default store;
