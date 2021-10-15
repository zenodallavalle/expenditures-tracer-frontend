import { getWorkingMonth } from 'utils';

import { getAuthToken, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const apiPoint = process.env.REACT_APP_API_ROOT;

const createCategory = async ({ payload, ...props }) => {
  const url = new URL(apiPoint + `categories/`);
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

const editCategory = async ({ id, payload, ...props }) => {
  const url = new URL(apiPoint + `categories/${id}/`);
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

const deleteCategory = async ({ id, ...props }) => {
  const url = new URL(apiPoint + `categories/${id}/`);
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

const categoryApi = {
  createCategory: tryCatchWrapper(createCategory),
  editCategory: tryCatchWrapper(editCategory),
  deleteCategory: tryCatchWrapper(deleteCategory),
};

export default categoryApi;
