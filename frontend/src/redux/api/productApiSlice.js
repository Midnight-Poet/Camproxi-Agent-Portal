import { PRODUCT_URL, UPLOAD_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const propertyApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCT_URL}/newProduct`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Properties'],
		}),
		getAllProduct: builder.query({
			query: () => ({
				url: `${PRODUCT_URL}/allProduct`,
				method: 'GET',
			}),
		}),
		// getProperty: builder.query({
		// 	query: (id) => ({
		// 		url: `${PRODUCT_URL}/getProperty/${id}`,
		// 		method: 'GET',
		// 	}),
		// }),
		updateProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCT_URL}/update`,
				method: 'PUT',
				body: data
			})
		}),
		deleteProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCT_URL}/delete`,
				method: 'DELETE',
				body: data
			}),
		})
	}),
});

export const { useCreateProductMutation, useGetAllProductQuery, useUpdateProductMutation, useDeleteProductMutation } =
	propertyApiSlice;
