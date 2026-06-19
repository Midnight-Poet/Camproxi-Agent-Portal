import { apiSlice } from './apiSlice';
import { AGENTS_URL } from '../feautures/constants';

export const agentApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `${AGENTS_URL}/`,
				method: 'POST',
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${AGENTS_URL}/logout`,
				method: 'POST',
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${AGENTS_URL}/register`,
				method: 'POST',
				body: data,
			}),
		}),
		updateAgent: builder.mutation({
			query: (data) => ({
				url: `${AGENTS_URL}/update`,
				method: 'PUT',
				body: data,
			}),
		}),
        changePassword: builder.mutation({
			query: (data) => ({
				url: `${AGENTS_URL}/changePassword`,
				method: 'PUT',
				body: data,
			}),
		}),
		getAgent: builder.query({
			query: (id) => ({
				url: `${AGENTS_URL}/fetch/${id}`,
				method: 'GET',
			}),
			invalidatesTags: true
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateAgentMutation,
	useGetAgentQuery,
    useChangePasswordMutation
} = agentApiSlice;
