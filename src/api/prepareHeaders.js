import {
  selectAuthToken,
  selectWorkingDBId,
  selectWorkingMonth,
} from 'rdx/params';

const prepareHeaders = async (headers, { getState, ...api } = {}) => {
  headers.set('Content-Type', 'application/json');
  const token = selectAuthToken(getState());
  if (token) headers.set('authorization', `Token ${token}`);
  const workingMonth = selectWorkingMonth(getState());
  const alreadySetWorkingMonth = headers.get('month');
  if (workingMonth && !alreadySetWorkingMonth)
    headers.set('month', workingMonth);
  const workingDBId = selectWorkingDBId(getState());
  if (workingDBId) headers.set('db', workingDBId);
  return headers;
};

export default prepareHeaders;
