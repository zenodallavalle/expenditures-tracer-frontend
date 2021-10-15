import { genUrl, getAuthToken, tryCatchWrapper } from './src/utils';
import RejectedRequest from './src/RejectedRequest';

const createExpenditure = async ({ payload, ...props }) => {
  const response = await fetch(genUrl(`expenditures/`), {
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

const editExpenditure = async ({ id, payload, ...props }) => {
  const response = await fetch(genUrl(`expenditures/${id}/`), {
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

const deleteExpenditure = async ({ id, ...props }) => {
  const response = await fetch(genUrl(`expenditures/${id}/`), {
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

const expenditureApi = {
  createExpenditure: tryCatchWrapper(createExpenditure),
  editExpenditure: tryCatchWrapper(editExpenditure),
  deleteExpenditure: tryCatchWrapper(deleteExpenditure),
};

export default expenditureApi;
