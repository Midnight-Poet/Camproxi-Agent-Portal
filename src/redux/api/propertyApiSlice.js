import { PROPERTY_URL, UPLOAD_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const propertyApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createProperty: builder.mutation({
			query: (data) => ({
				url: `${PROPERTY_URL}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Properties'],
		}),
		getAllProperty: builder.query({
			query: () => ({
				url: `${PROPERTY_URL}`,
				method: 'GET',
			}),
		}),
		getProperty: builder.query({
			query: (id) => ({
				url: `${PROPERTY_URL}/${id}`,
				method: 'GET',
			}),
		}),
		updateProperty: builder.mutation({
			query: ({ id, data }) => ({
				url: `${PROPERTY_URL}/${id}`,
				method: 'PATCH',
				body: data,
			}),
		}),
		deleteProperty: builder.mutation({
			query: (id) => ({
				url: `${PROPERTY_URL}/${id}`,
				method: 'DELETE',
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
