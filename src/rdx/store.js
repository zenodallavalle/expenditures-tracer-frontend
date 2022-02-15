import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer } from './user';
import { usersReducer } from './users';
import { databaseReducer } from './database';
import { expendituresReducer } from './expenditures';
import { alertsReducer } from './alerts';
import { searchReducer } from './search';

const newStore = () =>
  createStore(
    combineReducers({
      alerts: alertsReducer,
      user: userReducer,
      users: usersReducer,
      database: databaseReducer,
      expenditures: expendituresReducer,
      search: searchReducer,
    }),
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

const store = newStore();

export default store;
