import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectSearchParams } from 'rdx/params';
import { parseFloat, RequestsGrouper } from 'utils';

import { categoryApiSlice } from './categoryApiSlice';

const api = new RequestsGrouper({
  endpoint: '/expenditures/',
  generateFallbackendpoint: ({ id }) => `/expenditures/${id}/`,
});

const userApiSliceWithDBTags = categoryApiSlice.enhanceEndpoints({
  addTagTypes: ['expenditure'],
});

export const expenditureApiSlice = userApiSliceWithDBTags.injectEndpoints({
  endpoints: (builder) => ({
    getExpenditure: builder.query({
      queryFn: api.queryFn,
      providesTags: (result, error, { id, ...args }) => [
        { type: 'expenditure', id },
      ],
    }),

    searchExpenditures: builder.query({
      query: ({
        queryString,
        from,
        to,
        lowerPrice,
        upperPrice,
        type,
        ...arg
      }) => {
        const params = {};
        if (queryString !== undefined && queryString !== null)
          params.queryString = String(queryString).trim();
        if (from !== undefined && from !== null) params.from = from;
        if (to !== undefined && to !== null) params.to = to;
        if (
          lowerPrice !== undefined &&
          lowerPrice !== null &&
          parseFloat(lowerPrice)
        )
          params.lowerPrice = parseFloat(lowerPrice).toFixed(2);
        if (
          upperPrice !== undefined &&
          upperPrice !== null &&
          parseFloat(upperPrice)
        )
          params.upperPrice = parseFloat(upperPrice).toFixed(2);
        if (type !== undefined && type !== null) params.type = type;

        return { url: '/expenditures/search/', params };
      },
    }),

    newExpenditure: builder.mutation({
      query: ({
        name,
        value,
        date,
        expected_expenditure,
        is_expected,
        category,
      }) => ({
        url: `/expenditures/`,
        method: 'POST',
        body: {
          name,
          value,
          date,
          expected_expenditure,
          is_expected,
          category,
        },
      }),
      invalidatesTags: (result, error, { category }) => {
        const invalidatedTags = [
          { type: 'category', id: category },
          { type: 'db', id: result.db },
        ];
        if (result.expected_expenditure) {
          invalidatedTags.push({
            type: 'expenditure',
            id: result.expected_expenditure,
          });
        }

        return invalidatedTags;
      },
    }),

    newExpenditures: builder.mutation({
      query: (payload) => {
        const body = payload.map(
          ({
            name,
            value,
            date,
            expected_expenditure,
            is_expected,
            category,
          }) => ({
            name,
            value,
            date,
            expected_expenditure,
            is_expected,
            category,
          })
        );
        return {
          url: `/expenditures/`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (results, error, args) => {
        const invalidatedTags = [];

        Array.from(new Set(args.map(({ category }) => category))).forEach(
          (id) => {
            invalidatedTags.push({ type: 'category', id });
          }
        );

        Array.from(new Set(results.map(({ db }) => db))).forEach((id) => {
          invalidatedTags.push({ type: 'db', id });
        });

        Array.from(
          new Set(
            results.map(({ expected_expenditure }) => expected_expenditure)
          )
        ).forEach((expected_expenditure) => {
          if (expected_expenditure)
            invalidatedTags.push({
              type: 'expenditure',
              id: expected_expenditure,
            });
        });

        return invalidatedTags;
      },
    }),

    editExpenditure: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/expenditures/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (
        result,
        error,
        { id, value, category, expected_expenditure, ...arg }
      ) => {
        const invalidatedTags = [{ type: 'expenditure', id: id }];
        if (value) {
          invalidatedTags.push({ type: 'category', id: result.category });
          invalidatedTags.push({ type: 'db', id: result.db });
        }
        if (category) {
          invalidatedTags.push({ type: 'category', id: result.category });
          invalidatedTags.push({ type: 'db', id: result.db });
          // ideally also previous category - done in caller at ExpenditureEditor.jsx
        }
        if (expected_expenditure) {
          invalidatedTags.push({
            type: 'expenditure',
            id: expected_expenditure,
          });
          // ideally also previous expenditure - done in caller at ExpenditureEditor.jsx
        }
        return invalidatedTags;
      },
    }),

    deleteExpenditure: builder.mutation({
      query: ({ id, ...instance }) => ({
        url: `/expenditures/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, category, db, ...instance }) => [
        { type: 'category', id: category },
        { type: 'db', id: db },
      ],
    }),
  }),
});

export const {
  useGetExpenditureQuery,
  useSearchExpendituresQuery,
  useNewExpenditureMutation,
  useNewExpendituresMutation,
  useEditExpenditureMutation,
  useDeleteExpenditureMutation,
} = expenditureApiSlice;

export const useAutomaticSearchExpendituresDebouncedQuery = (
  { ...args } = {},
  { skip, debounceTimeMs = 300, ...api } = {}
) => {
  const selectedSearchParams = useSelector(selectSearchParams);
  const [searchParams, setSearchParams] = useState(selectedSearchParams);

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
    debouncedSetSearchParams(selectedSearchParams);
    return () => clearTimeout(timeout.current);
  }, [debouncedSetSearchParams, selectedSearchParams]);

  const { queryString, ...searchParamsButQueryString } = searchParams;

  const numberOfParams = useMemo(
    () =>
      Object.values(searchParamsButQueryString).reduce(
        (counter, value) =>
          value !== undefined && value !== null ? counter + 1 : counter,
        0
      ),
    [searchParamsButQueryString]
  );

  return useSearchExpendituresQuery(
    { ...searchParams },
    {
      skip:
        skip ||
        !queryString ||
        (String(queryString).length < 4 && numberOfParams < 3),
    }
  );
};
