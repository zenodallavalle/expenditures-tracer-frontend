import { getAuthToken, getWorkingMonth, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const apiPoint = process.env.REACT_APP_API_ROOT;

const createCash = async ({ payload, ...props }) => {
  const url = new URL(apiPoint + `cash/`);
  url.searchParams.append('month', getWorkingMonth());
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

const editCash = async ({ id, payload, ...props }) => {
  const url = new URL(apiPoint + `cash/${id}/`);
  url.searchParams.append('month', getWorkingMonth());
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

const deleteCash = async ({ id, ...props }) => {
  const url = new URL(apiPoint + `cash/${id}/`);
  url.searchParams.append('month', getWorkingMonth());
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

const cashApi = {
  createCash: tryCatchWrapper(createCash),
  editCash: tryCatchWrapper(editCash),
  deleteCash: tryCatchWrapper(deleteCash),
};

export default cashApi;
