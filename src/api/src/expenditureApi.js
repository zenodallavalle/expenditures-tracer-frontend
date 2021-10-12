import { RejectedRequest, tryCatchWrapper } from './utils';

const apiPoint = process.env.REACT_APP_API_ROOT;

const createExpenditure = async (
  getAuthToken,
  { payload, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `expenditures/`);
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

const editExpenditure = async (
  getAuthToken,
  { id, payload, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `expenditures/${id}/`);
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

const deleteExpenditure = async (
  getAuthToken,
  { id, workingMonth, ...props }
) => {
  const url = new URL(apiPoint + `expenditures/${id}/`);
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

const expenditureApiInitializer = (getAuthToken) => ({
  createExpenditure: tryCatchWrapper(getAuthToken)(createExpenditure),
  editExpenditure: tryCatchWrapper(getAuthToken)(editExpenditure),
  deleteExpenditure: tryCatchWrapper(getAuthToken)(deleteExpenditure),
});

export default expenditureApiInitializer;
