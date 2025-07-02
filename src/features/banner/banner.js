import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import bannerApi from "../../apis/banner";

export const banner = createApi({
	reducerPath: "Banner",
	baseQuery: fetchBaseQuery({baseUrl: ""}),
	tagTypes: ["Banner"],
	endpoints: (builder) => ({
		createBanner: builder.mutation({
			queryFn: async (credentials) => {
				const result = await bannerApi.createBanner(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Banner"],
		}),
		getBanner: builder.query({
			queryFn: async () => {
				const result = await bannerApi.getBanner();
				if (result.success) {
					return {data: result.data?.metadata?.banners || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Banner"],
		}),
		updateBanner: builder.mutation({
			queryFn: async (credentials) => {
				const result = await bannerApi.updateBanner(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Banner"],
		}),
		deleteBanner: builder.mutation({
			queryFn: async (id) => {
				const result = await bannerApi.deleteBanner(id);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Banner"],
		}),
	}),
});

export const {
	useCreateBannerMutation, useGetBannerQuery,
	useUpdateBannerMutation,
	useDeleteBannerMutation
} = banner;
