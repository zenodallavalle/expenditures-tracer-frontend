import RequestRejected from './RequestRejected';
const apiPoint = process.env.REACT_APP_API_ROOT;

const createCreateExpenditure =
  (getAuthToken) =>
  async ({ payload, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `expenditures/`);
      workingMonth && url.searchParams.append('month', workingMonth);
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
        throw new RequestRejected(true, response.status, json);
      }
    } catch (e) {
      if (e instanceof RequestRejected) {
        throw e;
      } else {
        console.error(e);
        // ERROR
        throw new RequestRejected();
      }
    }
  };

const createEditExpenditure =
  (getAuthToken) =>
  async ({ id, payload, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `expenditures/${id}/`);
      workingMonth && url.searchParams.append('month', workingMonth);
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
        throw new RequestRejected(
          true,
          response.status,
          json,
          response.status === 400
        );
      }
    } catch (e) {
      console.error(e);
      // ERROR
      throw new RequestRejected();
    }
  };

const createDeleteExpenditure =
  (getAuthToken) =>
  async ({ id, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `expenditures/${id}/`);
      workingMonth && url.searchParams.append('month', workingMonth);
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
        throw new RequestRejected(
          true,
          response.status,
          json,
          response.status === 400
        );
      }
    } catch (e) {
      console.error(e);
      // ERROR
      throw new RequestRejected();
    }
  };

const expenditureApiInitializer = (getAuthToken) => ({
  createExpenditure: createCreateExpenditure(getAuthToken),
  editExpenditure: createEditExpenditure(getAuthToken),
  deleteExpenditure: createDeleteExpenditure(getAuthToken),
});

export default expenditureApiInitializer;
