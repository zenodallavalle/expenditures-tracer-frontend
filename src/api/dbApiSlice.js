import { useSelector } from 'react-redux';

import { selectWorkingDBId, selectWorkingMonth } from 'rdx/params';

import { userApiSlice } from './userApiSlice';
import { RequestsGrouper } from 'utils';

const api = new RequestsGrouper({
  endpoint: '/dbs/',
  generateFallbackendpoint: ({ id }) => `/dbs/${id}/`,
});

export const dbApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFullDB: builder.query({
      query: ({ id, ...args }) => ({
        url: `/dbs/${id}/`,
      }),
      providesTags: (result, error, { id, ...arg }) => [{ type: 'db', id }],
    }),

    getLigthDB: builder.query({
      queryFn: api.queryFn,
      providesTags: (result, error, { id, ...arg }) => [
        { type: 'db', id: `db_light_${id}` },
      ],
    }),

    getDataForGraphs: builder.query({
      query: ({ id, ...args }) => ({
        url: `/dbs/${id}/graph/`,
      }),
      providesTags: (result, error, { id, ...arg }) => [
        { type: 'db', id: `db_graphs_${id}` },
      ],
    }),

    newDB: builder.mutation({
      query: ({ name }) => ({
        url: `/dbs/`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: [{ type: 'db', id: 'LIST' }],
    }),

    editDB: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/dbs/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id, ...arg }) => [
        { type: 'db', id: `db_light_${id}` },
      ],
    }),

    deleteDB: builder.mutation({
      query: ({ id }) => ({
        url: `/dbs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'db', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFullDBQuery,
  useGetLigthDBQuery,
  useGetDataForGraphsQuery,
  useNewDBMutation,
  useEditDBMutation,
  useDeleteDBMutation,
} = dbApiSlice;

export const useAutomaticGetFullDBQuery = (
  { ...args } = {},
  { skip, ...props } = {}
) => {
  const id = useSelector(selectWorkingDBId);
  const month = useSelector(selectWorkingMonth);

  return useGetFullDBQuery(
    {
      id,
      month,
    },
    { skip: skip || !id }
  );
};

export const useAutomaticGetDBForGraphsQuery = (
  { ...args } = {},
  { skip, ...props } = {}
) => {
  const id = useSelector(selectWorkingDBId);
  const month = useSelector(selectWorkingMonth);

  return useGetDataForGraphsQuery(
    {
      id,
      month,
    },
    { skip: skip || !id }
  );
};
