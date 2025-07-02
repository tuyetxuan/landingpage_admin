import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import statusContactApi from '../../apis/statusContact';

export const statusContact = createApi({
	reducerPath: 'StatusContact',
	baseQuery: fetchBaseQuery({baseUrl: ''}),
	tagTypes: ['StatusContact'],
	endpoints: (builder) => ({
		getStatusContacts: builder.query({
			queryFn: async () => {
				const result = await statusContactApi.getStatusContact();
				if (result.success) {
					return {data: result.data?.metadata?.submission_status || []};
				}
				return {error: {message: result.message, status: result.status}};
			},
			providesTags: ['StatusContact'],
		}),
	}),
});

export const {
	useGetStatusContactsQuery,
} = statusContact;
