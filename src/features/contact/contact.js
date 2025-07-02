import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import contactApi from "../../apis/contact";

export const contact = createApi({
	reducerPath: "Contact",
	baseQuery: fetchBaseQuery({baseUrl: ""}),
	tagTypes: ["Contact"],
	endpoints: (builder) => ({
		createContact: builder.mutation({
			queryFn: async (credentials) => {
				const result = await contactApi.createContact(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Contact"],
		}),
		getContact: builder.query({
			queryFn: async () => {
				const result = await contactApi.getContact();
				if (result.success) {
					return {data: result.data?.metadata?.contacts || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Contact"],
		}),
		updateContact: builder.mutation({
			queryFn: async (credentials) => {
				const result = await contactApi.updateContact(credentials);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Contact"],
		}),
		deleteContact: builder.mutation({
			queryFn: async (id) => {
				const result = await contactApi.deleteContact(id);
				if (result.success) {
					return {data: result.data?.metadata || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ["Contact"],
		}),
	}),
});

export const {
	useCreateContactMutation,
	useGetContactQuery,
	useUpdateContactMutation,
	useDeleteContactMutation,
} = contact;
