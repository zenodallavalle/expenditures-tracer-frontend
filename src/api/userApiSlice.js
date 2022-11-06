import { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  deletedAuthToken,
  deletedWorkingDBId,
  selectAuthToken,
  selectUserSearchParams,
  updatedAuthToken,
} from 'rdx/params';

import { RequestsGrouper } from 'utils';

import prepareHeaders from './prepareHeaders';

const userQueryFnBase = async (
  extraOptions,
  { signal, dispatch, getState },
  baseQuery
) => {
  const result = await baseQuery(extraOptions, { signal, dispatch, getState });
  if (result.meta?.response?.ok) {
    let token =
      result.data?.auth_token ||
      result.meta.request?.headers?.get('authorization');
    if (token) token = token.replace('Token ', '');
    if (token) dispatch(updatedAuthToken(token));
  } else if (result.error && result.error.status === 401) {
    dispatch(deletedAuthToken());
  }
  return result;
};

const userTokenAuthQueryFn = (
  { authToken, ...args } = {},
  api,
  extraOptions,
  baseQuery
) =>
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

const api = new RequestsGrouper({ endpoint: '/users/' });

export const userApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ROOT,
    prepareHeaders,
  }),
  tagTypes: ['user', 'db'],
  endpoints: (builder) => ({
    getUser: builder.query({
      queryFn: api.queryFn,
      providesTags: (result, error, { id, ...args }) => [{ type: 'user', id }],
    }),

    searchUsers: builder.query({
      query: ({ queryString, ...args }) => ({
        url: 'users/search/',
        params: { username: queryString },
      }),
    }),

    userTokenAuth: builder.query({
      queryFn: userTokenAuthQueryFn,
      providesTags: ({ id, dbs, ...result } = {}, error, arg) => {
        if (error) return [];

        const tags = [
          { type: 'user', id: 'token' },
          { type: 'db', id: 'LIST' },
        ];
        return tags;
      },
    }),

    login: builder.mutation({
      queryFn: loginQueryFn,
      invalidatesTags: [{ type: 'user', id: 'token' }],
    }),

    signup: builder.mutation({
      queryFn: signupQueryFn,
      invalidatesTags: [{ type: 'user', id: 'token' }],
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
      invalidatesTags: [{ type: 'user', id: 'token' }],
    }),
  }),
});

export const {
  useUserTokenAuthQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetUserQuery,
  useSearchUsersQuery,
} = userApiSlice;

export const useAutomaticUserTokenAuthQuery = (
  { ...args } = {},
  { skip, ...props } = {}
) => {
  const authToken = useSelector(selectAuthToken);
  return useUserTokenAuthQuery({ authToken }, { skip: !authToken || skip });
};

export const useAutomaticSearchUsersDebouncedQuery = (
  { ...args } = {},
  { skip, debounceTimeMs = 300, ...api } = {}
) => {
  const selectedUserSerachParams = useSelector(selectUserSearchParams);
  const [searchParams, setSearchParams] = useState(selectedUserSerachParams);

  const timeout = useRef();

  const debouncedSetSearchParams = useCallback(
    (params) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setSearchParams({ ...params });
      }, debounceTimeMs);
    },
    [debounceTimeMs]
  );

  useEffect(() => {
    debouncedSetSearchParams(selectedUserSerachParams);
    return () => clearTimeout(timeout.current);
  }, [debouncedSetSearchParams, selectedUserSerachParams]);

  const { queryString } = searchParams;

  return useSearchUsersQuery(
    { queryString: String(queryString).trim() },
    {
      skip: skip || !queryString || !String(queryString).trim(),
    }
  );
};
