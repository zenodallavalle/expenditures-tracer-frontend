import { RejectedRequest, tryCatchWrapper } from './utils';
const apiPoint = process.env.REACT_APP_API_ROOT;

const createCategory = async (
  getAuthToken,
  { payload, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `categories/`);
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

const editCategory = async (
  getAuthToken,
  { id, payload, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `categories/${id}/`);
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

const deleteCategory = async (getAuthToken, { id, workingMonth, ...props }) => {
  const url = new URL(apiPoint + `categories/${id}/`);
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

const categoryApiInitializer = (getAuthToken) => ({
  createCategory: tryCatchWrapper(getAuthToken)(createCategory),
  editCategory: tryCatchWrapper(getAuthToken)(editCategory),
  deleteCategory: tryCatchWrapper(getAuthToken)(deleteCategory),
});

export default categoryApiInitializer;
