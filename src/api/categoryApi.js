import { genUrl, getAuthToken, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const createCategory = async ({ payload, ...props }) => {
  const response = await fetch(genUrl(`categories/`), {
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

const editCategory = async ({ id, payload, ...props }) => {
  const response = await fetch(genUrl(`categories/${id}/`), {
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

const deleteCategory = async ({ id, ...props }) => {
  const response = await fetch(genUrl(`categories/${id}/`), {
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

const categoryApi = {
  createCategory: tryCatchWrapper(createCategory),
  editCategory: tryCatchWrapper(editCategory),
  deleteCategory: tryCatchWrapper(deleteCategory),
};

export default categoryApi;
