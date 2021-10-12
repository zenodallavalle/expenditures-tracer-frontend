import { RejectedRequest, tryCatchWrapper } from './utils';
const apiPoint = process.env.REACT_APP_API_ROOT;

const setWorkingDB = async (getAuthToken, { id, workingMonth, ...props }) => {
  const url = new URL(apiPoint + `dbs/${id}/`);
  if (workingMonth) {
    url.searchParams.append('month', workingMonth);
  }
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

const createDB = async (getAuthToken, { payload, ...props }) => {
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

const editDB = async (getAuthToken, { id, payload, ...props }) => {
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

const deleteDB = async (getAuthToken, { id, ...props }) => {
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

const databaseApiInitializer = (getAuthToken) => ({
  setWorkingDB: tryCatchWrapper(getAuthToken)(setWorkingDB),
  createDB: tryCatchWrapper(getAuthToken)(createDB),
  editDB: tryCatchWrapper(getAuthToken)(editDB),
  deleteDB: tryCatchWrapper(getAuthToken)(deleteDB),
});

export default databaseApiInitializer;
