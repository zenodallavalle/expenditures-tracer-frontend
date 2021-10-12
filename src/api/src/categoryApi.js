import RequestRejected from './RequestRejected';
const apiPoint = process.env.REACT_APP_API_ROOT;

const createCreateCategory =
  (getAuthToken) =>
  async ({ payload, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `categories/`);
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

const createEditCategory =
  (getAuthToken) =>
  async ({ id, payload, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `categories/${id}/`);
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

const createDeleteCategory =
  (getAuthToken) =>
  async ({ id, workingMonth, ...props }) => {
    try {
      const url = new URL(apiPoint + `categories/${id}/`);
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

const categoryApiInitializer = (getAuthToken) => ({
  createCategory: createCreateCategory(getAuthToken),
  editCategory: createEditCategory(getAuthToken),
  deleteCategory: createDeleteCategory(getAuthToken),
});

export default categoryApiInitializer;
