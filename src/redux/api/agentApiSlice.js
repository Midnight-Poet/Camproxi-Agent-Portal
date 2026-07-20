import { apiSlice } from './apiSlice';
import { AGENTS_URL } from '../feautures/constants';

export const agentApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `${AGENTS_URL}/login`,
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
				url: `${AGENTS_URL}/profile/update`,
				method: 'PATCH',
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
				url: `${AGENTS_URL}/profile`,
				method: 'GET',
			}),
			providesTags: ['Agent']
		}),
		getMe: builder.query({
			query: () => ({
				url: `${AGENTS_URL}/me`,
				method: 'GET',
			}),
			providesTags: ['Agent']
		}),
		deleteAgent: builder.mutation({
			query: () => ({
				url: `${AGENTS_URL}/profile`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Agent']
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateAgentMutation,
	useGetAgentQuery,
	useGetMeQuery,
    useChangePasswordMutation,
	useDeleteAgentMutation
} = agentApiSlice;
