import { getAuthToken, getWorkingMonth, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const apiPoint = process.env.REACT_APP_API_ROOT;

const setWorkingDB = async ({ id, ...props }) => {
  const url = new URL(apiPoint + `dbs/${id}/`);
  url.searchParams.append('month', getWorkingMonth());
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  } else {
    throw new RejectedRequest(response, json);
  }
};

const createDB = async ({ payload, ...props }) => {
  const response = await fetch(apiPoint + `dbs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  } else {
    throw new RejectedRequest(response, json);
  }
};

const editDB = async ({ id, payload, ...props }) => {
  const response = await fetch(apiPoint + `dbs/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  } else {
    throw new RejectedRequest(response, json);
  }
};

const deleteDB = async ({ id, ...props }) => {
  const response = await fetch(apiPoint + `dbs/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`,
    },
  });
  if (response.ok) {
    return;
  } else {
    const json = await response.json();
    throw new RejectedRequest(response, json);
  }
};

const databaseApi = {
  setWorkingDB: tryCatchWrapper(setWorkingDB),
  createDB: tryCatchWrapper(createDB),
  editDB: tryCatchWrapper(editDB),
  deleteDB: tryCatchWrapper(deleteDB),
};

export default databaseApi;
