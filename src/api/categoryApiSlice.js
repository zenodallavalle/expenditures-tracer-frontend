import { useSelector } from 'react-redux';

import { selectWorkingMonth } from 'rdx/params';
import { RequestsGrouper } from 'utils';

import { dbApiSlice } from './dbApiSlice';

const api = new RequestsGrouper({
  endpoint: '/categories/',
  customArgsToRTKArgsConverter: ({ month, ...args }) => ({
    headers: { month },
  }),
});

const userApiSliceWithDBTags = dbApiSlice.enhanceEndpoints({
  addTagTypes: ['category'],
});

export const categoryApiSlice = userApiSliceWithDBTags.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      queryFn: api.queryFn,
      providesTags: (result, error, { id, month, ...args }) => [
        { type: 'category', id },
      ],
    }),

    getCategoryWithoutProvidingTags: builder.query({
      queryFn: api.queryFn,
    }),

    newCategory: builder.mutation({
      query: ({ name }) => ({
        url: `/categories/`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: (result) => [{ type: 'db', id: result.db }],
      // async onQueryStarted({ args }, { dispatch, queryFulfilled }) {
      //   const { data: category } = await queryFulfilled;
      //   const { id, db } = category;
      //   dispatch(
      //     dbApiSlice.util.updateQueryData('getDB', db, (draft) => {
      //       draft.categories.push(id);
      //     })
      //   );
      // },
    }),

    editCategory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id, ...arg }) => [
        {
          type: 'category',
          id,
        },
      ],
      // async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
      //   console.log('onQueryStarted');
      //   dispatch(
      //     categoryApiSlice.util.updateQueryData('getCategory', id, (draft) => {
      //       Object.assign(draft, patch);
      //     })
      //   );
      //   try {
      //     await queryFulfilled;
      //   } catch {
      //     dispatch(
      //       categoryApiSlice.util.invalidateTags([
      //         {
      //           type: 'category',
      //           id,
      //         },
      //       ])
      //     );
      //   }
      // },
    }),

    deleteCategory: builder.mutation({
      query: ({ id, ...instance }) => ({
        url: `/categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, db, ...instance }) => [
        { type: 'db', id: db },
      ],
      // async onQueryStarted(
      //   { id, db, ...instance },
      //   { dispatch, queryFulfilled }
      // ) {
      //   dispatch(
      //     dbApiSlice.util.updateQueryData('getDB', db, (draft) => {
      //       delete draft.categories[id];
      //     })
      //   );
      //   try {
      //     await queryFulfilled;
      //   } catch {
      //     dbApiSlice.util.invalidateTags([{ type: 'db', id: db }]);
      //   }
      // },
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetCategoryWithoutProvidingTagsQuery,
  useNewCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;

export const useAutomaticGetCategoryQuery = (
  { id, ...args } = {},
  { skip, ...props } = {}
) => {
  const month = useSelector(selectWorkingMonth);
  return useGetCategoryQuery({ id, month }, { skip: skip });
};
