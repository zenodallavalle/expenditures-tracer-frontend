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
