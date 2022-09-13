import { useSelector } from 'react-redux';

import { selectWorkingDBId, selectWorkingMonth } from 'rdx/params';

import { userApiSlice } from './userApiSlice';

const userApiSliceWithDBTags = userApiSlice.enhanceEndpoints({
  addTagTypes: ['db'],
});

export const dbApiSlice = userApiSliceWithDBTags.injectEndpoints({
  endpoints: (builder) => ({
    getDB: builder.query({
      query: ({ id, month }) => {
        return {
          url: `/dbs/${id}/`,
          params: { month },
        };
      },
      providesTags: (result, error, arg) => [{ type: 'db', id: arg.id }],
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
      invalidatesTags: (result, error, arg) => [
        {
          type: 'db',
          id: arg.id,
        },
      ],
    }),

    deleteDB: builder.mutation({
      query: ({ id }) => ({
        url: `/dbs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'db',
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetDBQuery,
  useNewDBMutation,
  useEditDBMutation,
  useDeleteDBMutation,
} = dbApiSlice;

// export const selectPlaysResult = dbApiSlice.endpoints.getPlays.select();
// export const selectPlayResult = dbApiSlice.endpoints.getPlay.select();

export const useAutomaticGetDBQuery = ({ ...args }, { skip, ...props }) => {
  const workingDBId = useSelector(selectWorkingDBId);
  const workingMonth = useSelector(selectWorkingMonth);
  return useGetDBQuery(
    { id: workingDBId, month: workingMonth },
    { skip: skip || !workingDBId }
  );
};
