import { apiSlice } from './apiSlice';
import { NOTIFICATIONS_URL } from '../feautures/constants';

export const notificationsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query({
			query: () => ({
				url: NOTIFICATIONS_URL,
				method: 'GET',
			}),
			providesTags: ['Notifications'],
		}),
		markNotificationRead: builder.mutation({
			query: (id) => ({
				url: `${NOTIFICATIONS_URL}/${id}/read`,
				method: 'PATCH',
				body: {},
			}),
			invalidatesTags: ['Notifications'],
		}),
		markAllNotificationsRead: builder.mutation({
			query: () => ({
				url: `${NOTIFICATIONS_URL}/read-all`,
				method: 'PATCH',
				body: {},
			}),
			invalidatesTags: ['Notifications'],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useMarkNotificationReadMutation,
	useMarkAllNotificationsReadMutation,
} = notificationsApiSlice;
