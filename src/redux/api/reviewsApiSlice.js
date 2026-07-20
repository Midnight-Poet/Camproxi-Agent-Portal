import { REVIEWS_URL } from '../feautures/constants';
import { apiSlice } from './apiSlice';

export const reviewsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getItemReviews: builder.query({
			query: (itemId) => ({
				url: `${REVIEWS_URL}/item/${itemId}`,
				method: 'GET',
			}),
			providesTags: ['Reviews'],
		}),
		getItemRatings: builder.query({
			query: (itemId) => ({
				url: `${REVIEWS_URL}/item/${itemId}/ratings`,
				method: 'GET',
			}),
			providesTags: ['Reviews'],
		}),
		replyToReview: builder.mutation({
			query: ({ id, responseMessage }) => ({
				url: `${REVIEWS_URL}/${id}/reply`,
				method: 'POST',
				body: { responseMessage },
			}),
			invalidatesTags: ['Reviews'],
		}),
	}),
});

export const {
	useGetItemReviewsQuery,
	useGetItemRatingsQuery,
	useReplyToReviewMutation,
} = reviewsApiSlice;
