import userApi, { getAuthToken } from './src/userApi';
import databaseApiInitializer from './src/databaseApi';
import categoryApiInitializer from './src/categoryApi';
import expenditureApiInitializer from './src/expenditureApi';
import cashApiInitializer from './src/cashApi';

import RequestRejected from './src/RequestRejected';

export { default as userApi } from './src/userApi';
export const databaseApi = databaseApiInitializer(getAuthToken);
export const categoryApi = categoryApiInitializer(getAuthToken);
export const expenditureApi = expenditureApiInitializer(getAuthToken);
export const cashApi = cashApiInitializer(getAuthToken);
export { default as RequestRejected } from './src/RequestRejected';

const api = {
  RequestRejected,
  userApi,
  cashApi,
  databaseApi,
  categoryApi,
  expenditureApi,
};
export default api;
