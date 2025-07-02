import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import userApi from '../../apis/user.js';

export const user = createApi({
	reducerPath: 'UserAuth',
	baseQuery: fetchBaseQuery({baseUrl: ''}),
	tagTypes: ['UserAuth'],
	endpoints: (builder) => ({
		getUser: builder.query({
			queryFn: async (credentials) => {
				const result = await userApi.getUser();
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ['UserAuth'],
		}),
		updateUser: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.updateUser(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			invalidatesTags: ['UserAuth'],
		}),
		getAllUser: builder.query({
			queryFn: async () => {
				const result = await userApi.getAllUsers();
				if (result.success) {
					return {data: result.data?.metadata?.users || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ['UserAuth'],
		}),
		createUser: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.createUser(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			invalidatesTags: ['UserAuth'],
		}),
		updateUserRole: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.updateUserRole(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			invalidatesTags: ['UserAuth'],
		}),
		resetPassword: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.resetPassword(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			invalidatesTags: ['UserAuth'],
		}),
		updateUserStatus: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.updateUserStatus(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			invalidatesTags: ['UserAuth'],
		}),
		logOut: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.logOut(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
					
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ['UserAuth'],
		}),
		changePassword: builder.mutation({
			queryFn: async (credentials) => {
				const result = await userApi.changePassword(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			invalidatesTags: ['UserAuth'],
		}),
	}),
});

export const {
	useGetUserQuery, useUpdateUserMutation
	, useGetAllUserQuery,
	useCreateUserMutation,
	useUpdateUserRoleMutation,
	useResetPasswordMutation,
	useUpdateUserStatusMutation,
	useLogOutMutation,
	useChangePasswordMutation
} = user;
