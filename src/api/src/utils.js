import store from 'rdx/store';

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

export const selectWorkingMonth = (s) => s.localInfo.workingMonth;
export const getWorkingMonth = () => selectWorkingMonth(store.getState());
export const getAuthToken = () => localStorage.getItem('authToken');
