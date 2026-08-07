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
			async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					apiSlice.util.updateQueryData('getChats', undefined, (draftChats) => {
						const arr = Array.isArray(draftChats) ? draftChats : (draftChats?.data || draftChats?.chats || []);
						const chat = arr.find(c => String(c.id || c._id) === String(chatId));
						if (chat && chat.messages) {
							chat.messages.forEach(m => {
								const isMine = m.senderType === 'AGENT' || m.senderModel === 'AGENT' || m.from === 'me';
								if (!isMine) {
									m.isRead = true;
								}
							});
						}
					})
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			}
		}),
	}),
});

export const {
	useGetChatsQuery,
	useGetChatMessagesQuery,
	useInitiateChatMutation,
	useMarkChatReadMutation,
} = chatApiSlice;
