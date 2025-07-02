import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import categoryArticleApi from '../../apis/category';

export const categoryArticle = createApi({
  reducerPath: 'CategoryArticle',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['CategoryArticle'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      queryFn: async () => {
        const result = await categoryArticleApi.getCategories();
        if (result.success) {
          return { data: result.data?.metadata?.article_categories || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['CategoryArticle'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
} = categoryArticle;
