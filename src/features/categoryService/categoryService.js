import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import categoryServiceApi from '../../apis/categoryService.js';

export const categoryService = createApi({
  reducerPath: 'CategoryService',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['CategoryService'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      queryFn: async () => {
        const result = await categoryServiceApi.getCategories();
        if (result.success) {
          return { data: result.data?.metadata?.service_categories || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['CategoryService'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
} = categoryService;
