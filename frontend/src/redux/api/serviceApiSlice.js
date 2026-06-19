import { SERVICE_URL, UPLOAD_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const serviceApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createService: builder.mutation({
			query: (data) => ({
				url: `${SERVICE_URL}/newService`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Properties'],
		}),
		getAllService: builder.query({
			query: () => ({
				url: `${SERVICE_URL}/allService`,
				method: 'GET',
			}),
		}),
		// getProperty: builder.query({
		// 	query: (id) => ({
		// 		url: `${PRODUCT_URL}/getProperty/${id}`,
		// 		method: 'GET',
		// 	}),
		// }),
		updateService: builder.mutation({
			query: (data) => ({
				url: `${SERVICE_URL}/update`,
				method: 'PUT',
				body: data,
			}),
		}),
		deleteService: builder.mutation({
			query: (data) => ({
				url: `${SERVICE_URL}/delete`,
				method: 'DELETE',
				body: data,
			}),
		}),
	}),
});

export const {
	useCreateServiceMutation,
	useGetAllServiceQuery,
	useUpdateServiceMutation,
	useDeleteServiceMutation,
} = serviceApiSlice;
