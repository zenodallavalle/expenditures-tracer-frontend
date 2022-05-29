import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from './user';
import { usersReducer } from './users';
import { databaseReducer } from './database';
import { expendituresReducer } from './expenditures';
import { alertsReducer } from './alerts';
import { searchReducer } from './search';

const newStore = () =>
  configureStore({
    reducer: {
      alerts: alertsReducer,
      user: userReducer,
      users: usersReducer,
      database: databaseReducer,
      expenditures: expendituresReducer,
      search: searchReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

const store = newStore();

export default store;
