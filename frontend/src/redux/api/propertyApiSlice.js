import { PROPERTY_URL, UPLOAD_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const propertyApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createProperty: builder.mutation({
			query: (data) => ({
				url: `${PROPERTY_URL}/create`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Properties'],
		}),
		getAllProperty: builder.query({
			query: () => ({
				url: `${PROPERTY_URL}/getAll`,
				method: 'GET',
			}),
		}),
		getProperty: builder.query({
			query: (id) => ({
				url: `${PROPERTY_URL}/getProperty/${id}`,
				method: 'GET',
			}),
		}),
		updateProperty: builder.mutation({
			query: (data) => ({
				url: `${PROPERTY_URL}/update`,
				method: 'PUT',
				body: data,
			}),
		}),
		deleteProperty: builder.mutation({
			query: (data) => ({
				url: `${PROPERTY_URL}/delete`,
				method: 'DELETE',
				body: data,
			}),
			invalidatesTags: ['Properties'],
		}),
	}),
});

export const {
	useCreatePropertyMutation,
	useGetAllPropertyQuery,
	useGetPropertyQuery,
	useUpdatePropertyMutation,
	useDeletePropertyMutation,
} = propertyApiSlice;
