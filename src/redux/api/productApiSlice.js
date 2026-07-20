import { PRODUCT_URL, UPLOAD_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const propertyApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCT_URL}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Products'],
		}),
		getAllProduct: builder.query({
			query: () => ({
				url: `${PRODUCT_URL}`,
				method: 'GET',
			}),
		}),
		getProduct: builder.query({
			query: (id) => ({
				url: `${PRODUCT_URL}/${id}`,
				method: 'GET',
			}),
		}),
		updateProduct: builder.mutation({
			query: ({ id, data }) => ({
				url: `${PRODUCT_URL}/${id}`,
				method: 'PATCH',
				body: data
			})
		}),
		deleteProduct: builder.mutation({
			query: (id) => ({
				url: `${PRODUCT_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Products'],
		})
	}),
});

export const { useCreateProductMutation, useGetAllProductQuery, useUpdateProductMutation, useDeleteProductMutation } =
	propertyApiSlice;
