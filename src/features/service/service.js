import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import serviceApi from '../../apis/service.js';

export const services = createApi({
  reducerPath: 'Services',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    createService: builder.mutation({
      queryFn: async (credentials) => {
        const result = await serviceApi.createService(credentials);
        if (result.success) {
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Services'],
    }),
    getService: builder.query({
      queryFn: async () => {
        const result = await serviceApi.getService();
        if (result.success) {
          return { data: result.data?.metadata?.services || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Services'],
    }),
    updateService: builder.mutation({
      queryFn: async (credentials) => {
        const result = await serviceApi.updateService(credentials);
        if (result.success) {
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Services'],
    }),
    deleteService: builder.mutation({
      queryFn: async (id) => {
        const result = await serviceApi.deleteService(id);
        if (result.success) {
          return { data: result.data?.metadata || [] };
        }
        return { error: { message: result.message, status: result.status } };
      },
      providesTags: ['Services'],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = services;
