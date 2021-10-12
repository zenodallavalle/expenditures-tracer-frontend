import RequestRejected from './RequestRejected';
const apiPoint = process.env.REACT_APP_API_ROOT;

const createCreateCash =
  (getAuthToken) =>
  async ({ payload, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `cash/`);
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

const createEditCash =
  (getAuthToken) =>
  async ({ id, payload, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `cash/${id}/`);
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

const createDeleteCash =
  (getAuthToken) =>
  async ({ id, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `cash/${id}/`);
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

const cashApiInitializer = (getAuthToken) => ({
  createCash: createCreateCash(getAuthToken),
  editCash: createEditCash(getAuthToken),
  deleteCash: createDeleteCash(getAuthToken),
});

export default cashApiInitializer;
