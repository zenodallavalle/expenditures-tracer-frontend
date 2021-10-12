import { RejectedRequest, tryCatchWrapper } from './utils';
const apiPoint = process.env.REACT_APP_API_ROOT;

const createCash = async (
  getAuthToken,
  { payload, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `cash/`);
  if (workingMonth) {
    url.searchParams.append('month', workingMonth);
  }
  const response = await fetch(url, {
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

const editCash = async (
  getAuthToken,
  { id, payload, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `cash/${id}/`);
  if (workingMonth) {
    url.searchParams.append('month', workingMonth);
  }
  const response = await fetch(url, {
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

const deleteCash = async (getAuthToken, { id, workingMonth, ...props }) => {
  const url = new URL(apiPoint + `cash/${id}/`);
  if (workingMonth) {
    url.searchParams.append('month', workingMonth);
  }
  const response = await fetch(url, {
    method: 'DELETE',
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

const cashApiInitializer = (getAuthToken) => ({
  createCash: tryCatchWrapper(getAuthToken)(createCash),
  editCash: tryCatchWrapper(getAuthToken)(editCash),
  deleteCash: tryCatchWrapper(getAuthToken)(deleteCash),
});

export default cashApiInitializer;
