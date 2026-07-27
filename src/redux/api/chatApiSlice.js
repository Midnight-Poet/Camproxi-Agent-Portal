import { apiSlice } from './apiSlice';
import { CHATS_URL } from '../feautures/constants';

export const chatApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getChats: builder.query({
			query: () => ({
				url: CHATS_URL,
				method: 'GET',
			}),
			providesTags: ['Chats'],
		}),
		getChatMessages: builder.query({
			query: (chatId) => ({
				url: `${CHATS_URL}/${chatId}/messages`,
				method: 'GET',
			}),
			providesTags: (result, error, chatId) => [{ type: 'ChatMessages', id: chatId }],
		}),
		initiateChat: builder.mutation({
			query: (data) => ({
				url: `${CHATS_URL}/initiate`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Chats'],
		}),
		markChatRead: builder.mutation({
			query: (chatId) => ({
				url: `${CHATS_URL}/${chatId}/read`,
				method: 'PATCH',
				body: {},
			}),
			// Instead of invalidating 'Chats', which causes a refetch,
			// optimistic updates might be better or just invalidate.
			invalidatesTags: ['Chats'],
		}),
	}),
});

export const {
	useGetChatsQuery,
	useGetChatMessagesQuery,
	useInitiateChatMutation,
	useMarkChatReadMutation,
} = chatApiSlice;
