import { apiSlice } from "./apiSlice";
import { NOTIFICATIONS_URL } from "../feautures/constants";

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => NOTIFICATIONS_URL,
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getNotifications', undefined, (draft) => {
            const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.notifications || []);
            const notif = arr.find((n) => String(n.id || n._id) === String(id));
            if (notif) notif.isRead = true;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/read-all`,
        method: "PATCH",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getNotifications', undefined, (draft) => {
            const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.notifications || []);
            arr.forEach(n => { n.isRead = true; });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApiSlice;
