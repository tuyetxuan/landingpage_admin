import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import articleApi from '../../apis/article';

export const article = createApi({
  reducerPath: 'Article',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['Article'],
  endpoints: (builder) => ({
    createArticle: builder.mutation({
      queryFn: async (credentials) => {
        const result = await articleApi.createArticle(credentials);
        if (result.success) {
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Article'],
    }),
    getArticle: builder.query({
      queryFn: async () => {
        const result = await articleApi.getArticle();
        if (result.success) {
          return { data: result.data?.metadata?.articles || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Article'],
    }),
    updateArticle: builder.mutation({
      queryFn: async (credentials) => {
        const result = await articleApi.updateArticle(credentials);
        if (result.success) {
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Article'],
    }),
    deleteArticle: builder.mutation({
      queryFn: async (id) => {
        const result = await articleApi.deleteArticle(id);
        if (result.success) {
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Article'],
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useGetArticleQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = article;
