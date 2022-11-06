import { RequestsGrouper } from 'utils';

import { dbApiSlice } from './dbApiSlice';

const api = new RequestsGrouper({
  endpoint: '/cash/',
  generateFallbackendpoint: ({ id }) => `/cash/${id}/`,
});

const userApiSliceWithCashTags = dbApiSlice.enhanceEndpoints({
  addTagTypes: ['cash'],
});

export const cashApiSlice = userApiSliceWithCashTags.injectEndpoints({
  endpoints: (builder) => ({
    getCash: builder.query({
      queryFn: api.queryFn,
      providesTags: (result, error, { id, ...args }) => [{ type: 'cash', id }],
    }),

    newCash: builder.mutation({
      query: ({ name, value, income }) => ({
        url: `/cash/`,
        method: 'POST',
        body: { name, value, income },
      }),
      invalidatesTags: ({ db }, error, arg) => [{ type: 'db', id: db }],
    }),

    editCash: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/cash/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ({ db }, error, arg) => {
        const invalidatedTags = [
          {
            type: 'cash',
            id: arg.id,
          },
        ];
        if (arg.value) {
          invalidatedTags.push({ type: 'db', id: db });
        }
        return invalidatedTags;
      },
    }),

    deleteCash: builder.mutation({
      query: ({ id, ...instance }) => ({
        url: `/cash/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, db, ...instance }) => [
        { type: 'db', id: db },
      ],
    }),
  }),
});

export const {
  useGetCashQuery,
  useNewCashMutation,
  useEditCashMutation,
  useDeleteCashMutation,
} = cashApiSlice;
