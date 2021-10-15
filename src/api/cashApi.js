import { genUrl, getAuthToken, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const createCash = async ({ payload, ...props }) => {
  const response = await fetch(genUrl('cash/'), {
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

const editCash = async ({ id, payload, ...props }) => {
  const response = await fetch(genUrl(`cash/${id}/`), {
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

const deleteCash = async ({ id, ...props }) => {
  const response = await fetch(genUrl(`cash/${id}/`), {
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

const cashApi = {
  createCash: tryCatchWrapper(createCash),
  editCash: tryCatchWrapper(editCash),
  deleteCash: tryCatchWrapper(deleteCash),
};

export default cashApi;
