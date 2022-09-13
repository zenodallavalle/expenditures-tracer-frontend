import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  deletedAuthToken,
  deletedWorkingDBId,
  selectAuthToken,
  updatedAuthToken,
  updatedWorkingDBId,
} from 'rdx/params';

const prepareHeaders = async (headers, { getState, ...api } = {}) => {
  headers.set('Content-Type', 'application/json');
  const token = selectAuthToken(getState());
  if (token) headers.set('authorization', `Token ${token}`);
  return headers;
};

const userQueryFnBase = async (
  extraOptions,
  { signal, dispatch, getState },
  baseQuery
) => {
  const optionsHeaders = new Headers(extraOptions.headers || {});
  const result = await baseQuery(
    {
      ...extraOptions,
      headers: prepareHeaders(optionsHeaders, {
        signal,
        dispatch,
        getState,
      }),
    },
    { signal, dispatch, getState }
  );
  if (result.meta?.response.ok) {
    let token =
      result.data?.auth_token ||
      result.meta.request?.headers?.get('authorization');
    if (token) token = token.replace('Token ', '');
    if (token) dispatch(updatedAuthToken(token));
    const dbs = result.data?.dbs;
    if (dbs.length === 1) dispatch(updatedWorkingDBId(dbs[0]));
  } else if (result.error && result.error.status === 401) {
    dispatch(deletedAuthToken());
  }
  return result;
};

const userTokenAuthQueryFn = (_, api, extraOptions, baseQuery) =>
  userQueryFnBase(
    {
      ...extraOptions,
      url: `/api-token-auth/`,
    },
    api,
    baseQuery
  );

const loginQueryFn = ({ username, password }, api, extraOptions, baseQuery) =>
  userQueryFnBase(
    {
      ...extraOptions,
      body: { username, password },
      method: 'POST',
      url: `/api-token-auth/`,
    },
    api,
    baseQuery
  );

const signupQueryFn = (payload, api, extraOptions, baseQuery) =>
  userQueryFnBase(
    {
      ...extraOptions,
      body: payload,
      method: 'POST',
      url: `/users/`,
    },
    api,
    baseQuery
  );

export const userApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ROOT,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ['user'],
  endpoints: (builder) => ({
    userTokenAuth: builder.query({
      queryFn: userTokenAuthQueryFn,
      providesTags: ['user'],
    }),
    login: builder.mutation({
      queryFn: loginQueryFn,
      invalidatesTags: ['user'],
    }),
    signup: builder.mutation({
      queryFn: signupQueryFn,
      invalidatesTags: ['user'],
    }),
    logout: builder.mutation({
      queryFn: async (
        extraOptions,
        { signal, dispatch, getState },
        baseQuery
      ) => {
        dispatch(deletedAuthToken());
        dispatch(deletedWorkingDBId());
        return { data: null };
      },
      invalidatesTags: ['user'],
    }),
  }),
});

export const {
  useUserTokenAuthQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = userApiSlice;
