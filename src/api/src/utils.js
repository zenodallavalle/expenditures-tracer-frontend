import { getCurrentMonth } from 'utils';
import RejectedRequest from './RejectedRequest';

export const tryCatchWrapper =
  (f) =>
  async ({ ...props } = {}) => {
    try {
      return await f({ ...props });
    } catch (e) {
      if (e instanceof RejectedRequest) throw e;
      else {
        console.error(e);
        throw new RejectedRequest();
      }
    }
  };

export const getAuthToken = () => localStorage.getItem('authToken');

export const genUrl = (type, params = {}, includeCurrentMonth = true) => {
  const apiPoint = process.env.REACT_APP_API_ROOT;
  try {
    const url = new URL(`${apiPoint}${type}`);
    if (includeCurrentMonth) {
      url.searchParams.set('month', getCurrentMonth());
    }

    Object.entries(params).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
    return url;
  } catch {
    const url = new URL(`${window.location.host}${apiPoint}${type}/`);
    Object.entries(params).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });
    return url;
  }
};
