import RequestRejected from './RequestRejected';
const apiPoint = process.env.REACT_APP_API_ROOT;

const createSetWorkingDB =
  (getAuthToken) =>
  async ({ id, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `dbs/${id}/`);
      workingMonth && url.searchParams.append('month', workingMonth);
      const response = await fetch(url, {
        method: 'GET',
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

const createCreateDB =
  (getAuthToken) =>
  async ({ payload, ...props }) => {
    try {
      const response = await fetch(apiPoint + `dbs/`, {
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

const createEditDB =
  (getAuthToken) =>
  async ({ id, payload, ...props }) => {
    try {
      const response = await fetch(apiPoint + `dbs/${id}/`, {
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

const createDeleteDB =
  (getAuthToken) =>
  async ({ id, ...props }) => {
    try {
      const response = await fetch(apiPoint + `dbs/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${getAuthToken()}`,
        },
      });
      if (response.ok) {
        return;
      } else {
        const json = await response.json();
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

const databaseApiInitializer = (getAuthToken) => ({
  setWorkingDB: createSetWorkingDB(getAuthToken),
  createDB: createCreateDB(getAuthToken),
  editDB: createEditDB(getAuthToken),
  deleteDB: createDeleteDB(getAuthToken),
});

export default databaseApiInitializer;
