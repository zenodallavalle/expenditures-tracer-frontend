import { getWorkingMonth } from 'utils';

import { genUrl, getAuthToken, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const setWorkingDB = async ({
  id,
  workingMonth = getWorkingMonth(),
  ...props
}) => {
  const response = await fetch(genUrl(`dbs/${id}/`, { month: workingMonth }), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
  });
  const json = await response.json();
  if (response.ok) return json;
  else throw new RejectedRequest(response, json);
};

const createDB = async ({ payload, ...props }) => {
  const response = await fetch(genUrl('dbs/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (response.ok) return json;
  else throw new RejectedRequest(response, json);
};

const editDB = async ({ id, payload, ...props }) => {
  const response = await fetch(genUrl(`dbs/${id}/`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (response.ok) return json;
  else throw new RejectedRequest(response, json);
};

const deleteDB = async ({ id, ...props }) => {
  const response = await fetch(genUrl(`dbs/${id}/`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
  });
  const json = await response.json();
  if (response.ok) return json;
  else throw new RejectedRequest(response, json);
};

const databaseApi = {
  setWorkingDB: tryCatchWrapper(setWorkingDB),
  createDB: tryCatchWrapper(createDB),
  editDB: tryCatchWrapper(editDB),
  deleteDB: tryCatchWrapper(deleteDB),
};

export default databaseApi;
