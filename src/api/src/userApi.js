import { createAsyncThunk } from '@reduxjs/toolkit';

const genOkStatusFromResponse = (response) => ({
  ok: response.ok,
  status: response.status,
});

const apiPoint = process.env.REACT_APP_API_ROOT;

let authToken = localStorage.getItem('authToken');

export const getAuthToken = () => authToken;

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  authToken = token;
};
const deleteAuthToken = () => {
  localStorage.removeItem('authToken');
  authToken = null;
};

const userApi = {};

userApi.tryAuthToken = createAsyncThunk(
  'user/tryAuthLogin',
  async ({ ...props } = {}, thunkAPI) => {
    try {
      const response = await fetch(apiPoint + 'api-token-auth/', {
        headers: { Authorization: `Token ${authToken}` },
      });
      if (!response.ok) {
        deleteAuthToken();
        return thunkAPI.rejectWithValue(null, {
          response: genOkStatusFromResponse(response),
        });
      }
      const json = await response.json();
      return thunkAPI.fulfillWithValue(json, {
        response: genOkStatusFromResponse(response),
      });
    } catch (e) {
      console.error(e);
      throw Error('serviceUnreachable');
    }
  },
  {
    condition: () => {
      return Boolean(getAuthToken());
    },
    dispatchConditionRejection: true,
  }
);

userApi.login = createAsyncThunk(
  'user/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await fetch(apiPoint + 'api-token-auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const json = await response.json();
      if (json.auth_token) {
        setAuthToken(json.auth_token);
        delete json.auth_token;
      }
      if (response.ok) {
        return thunkAPI.fulfillWithValue(json, {
          response: genOkStatusFromResponse(response),
        });
      } else {
        return thunkAPI.rejectWithValue(json, {
          response: genOkStatusFromResponse(response),
        });
      }
    } catch (e) {
      console.error(e);
      throw Error('serviceUnreachable');
    }
  }
);

userApi.logout = createAsyncThunk(
  'user/logout',
  async ({ ...props } = {}, thunkAPI) => {
    deleteAuthToken();
    localStorage.removeItem('workingDBId');
    return null;
  }
);

export default userApi;
