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

const searchExpenditure = async ({
  queryString,
  from,
  to,
  lowerPrice,
  upperPrice,
  type,
  ...props
}) => {
  const params = {};
  if (queryString) params.queryString = queryString;
  if (from) params.from = from;
  if (to) params.to = to;
  if (lowerPrice) params.lowerPrice = lowerPrice;
  if (upperPrice) params.upperPrice = upperPrice;
  if (type) params.type = type;
  const response = await fetch(genUrl('expenditures/search/', params, false), {
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

const expenditureApi = {
  createExpenditure: tryCatchWrapper(createExpenditure),
  editExpenditure: tryCatchWrapper(editExpenditure),
  deleteExpenditure: tryCatchWrapper(deleteExpenditure),
  searchExpenditure: tryCatchWrapper(searchExpenditure),
};

export default expenditureApi;
