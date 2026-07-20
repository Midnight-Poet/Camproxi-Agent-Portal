import { REQUESTS_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const requestsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAgentRequests: builder.query({
			query: () => ({
				url: `${REQUESTS_URL}`,
				method: 'GET',
			}),
			providesTags: ['Requests'],
		}),
		respondToRequest: builder.mutation({
			query: ({ id, data }) => ({
				url: `${REQUESTS_URL}/${id}/respond`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Requests'],
		}),
	}),
});

export const {
	useGetAgentRequestsQuery,
	useRespondToRequestMutation,
} = requestsApiSlice;
