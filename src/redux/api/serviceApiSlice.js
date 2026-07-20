import { SERVICE_URL, UPLOAD_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const serviceApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createService: builder.mutation({
			query: (data) => ({
				url: `${SERVICE_URL}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Services'],
		}),
		getAllService: builder.query({
			query: () => ({
				url: `${SERVICE_URL}`,
				method: 'GET',
			}),
		}),
		getService: builder.query({
			query: (id) => ({
				url: `${SERVICE_URL}/${id}`,
				method: 'GET',
			}),
		}),
		updateService: builder.mutation({
			query: ({ id, data }) => ({
				url: `${SERVICE_URL}/${id}`,
				method: 'PATCH',
				body: data,
			}),
		}),
		deleteService: builder.mutation({
			query: (id) => ({
				url: `${SERVICE_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Services'],
		}),
	}),
});

export const {
	useCreateServiceMutation,
	useGetAllServiceQuery,
	useUpdateServiceMutation,
	useDeleteServiceMutation,
} = serviceApiSlice;
