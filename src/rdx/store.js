import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer } from './user';
import { databaseReducer } from './database';
import { expendituresReducer } from './expenditures';
import { localInfoReducer } from './localInfo';
import { alertsReducer } from './alerts';

const newStore = () =>
  createStore(
    combineReducers({
      alerts: alertsReducer,
      localInfo: localInfoReducer,
      user: userReducer,
      database: databaseReducer,
      expenditures: expendituresReducer,
    }),
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

export default newStore;
