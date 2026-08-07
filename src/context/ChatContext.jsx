import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { BASE_URL } from '../redux/feautures/constants';
import { apiSlice } from '../redux/api/apiSlice';
import { useNotification } from './NotificationContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const [chatSocket, setChatSocket] = useState(null);
	const { setNotifToast } = useNotification();

	useEffect(() => {
		if (!userInfo) return;

		const socket = io(
			BASE_URL ? `${BASE_URL}/chat` : '/chat',
			{
				withCredentials: true,
				transports: ['websocket', 'polling'],
				reconnection: true,
				reconnectionAttempts: 10,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000
			}
		);

		setChatSocket(socket);

		socket.on('newMessage', (raw) => {
			// Safe extraction: if raw has id/_id, it's the raw message object itself
			const msg = (raw?.id || raw?._id) ? raw : (raw?.message ?? raw?.data ?? raw);
			const chatId = String(msg?.chatId ?? '');
			if (!chatId) return;
			
			// Optimistically update the specific chat messages list
			// Also reconcile: replace any optimistic placeholder with the real message
			dispatch(
				apiSlice.util.updateQueryData('getChatMessages', chatId, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.messages || []);
					// Check for exact ID match (true duplicate)
					const exactDup = arr.find((m) => String(m.id || m._id) === String(msg.id || msg._id));
					if (exactDup) return;
					// Check for optimistic placeholder with same content (replace it)
					const optIdx = arr.findIndex((m) => String(m.id || '').startsWith('opt-') && m.content === msg.content);
					if (optIdx !== -1) {
						arr[optIdx] = msg; // replace optimistic with real
					} else {
						arr.push(msg);
					}
				})
			);

			// Optimistically update the chats list preview and unread count
			dispatch(
				apiSlice.util.updateQueryData('getChats', undefined, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.chats || []);
					const chat = arr.find((c) => String(c.id || c._id) === chatId);
					if (chat) {
						if (!chat.messages) chat.messages = [];
						const exactDup = chat.messages.find((m) => String(m.id || m._id) === String(msg.id || msg._id));
						if (exactDup) return;
						const optIdx = chat.messages.findIndex((m) => String(m.id || '').startsWith('opt-') && m.content === msg.content);
						if (optIdx !== -1) {
							chat.messages[optIdx] = msg;
						} else {
							chat.messages.push(msg);
						}
					}
				})
			);

			// Show toast if the message is NOT from the agent and we are not on the messages page
			const isMine = msg.senderType === 'AGENT' || msg.senderModel === 'AGENT' || msg.from === 'me';
			if (!isMine && !window.location.pathname.startsWith('/messages')) {
				setNotifToast({
					title: 'New Message',
					msg: msg.content || msg.text || 'You have received a new message.',
					icon: 'chat',
					link: '/messages'
				});
			}

			// Do not invalidate tags here to avoid race conditions with backend replica lag
			// rely entirely on the optimistic update.
		});

		socket.on('messagesRead', (raw) => {
			const data = raw?.message ?? raw?.data ?? raw;
			const chatId = String(data?.chatId ?? '');
			const readBy = data?.readBy; // 'STUDENT' or 'AGENT'
			if (!chatId) return;

			// Determine which messages to mark as read based on who read them:
			// If the STUDENT read messages, mark AGENT messages as read (blue ticks ✓✓)
			// If the AGENT read messages, mark STUDENT messages as read (clears unread count)
			const shouldMark = (m) => {
				const mine = m.senderType === 'AGENT' || m.senderModel === 'AGENT' || m.from === 'me';
				if (readBy === 'STUDENT') return mine;  // student read our messages
				if (readBy === 'AGENT') return !mine;    // we read student messages
				return true; // fallback: mark all if readBy is missing
			};
			
			// Update the active chat thread
			dispatch(
				apiSlice.util.updateQueryData('getChatMessages', chatId, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.messages || []);
					arr.forEach(m => {
						if (!m.isRead && shouldMark(m)) m.isRead = true;
					});
				})
			);

			// Update the chats list
			dispatch(
				apiSlice.util.updateQueryData('getChats', undefined, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.chats || []);
					const chat = arr.find((c) => String(c.id || c._id) === chatId);
					if (chat && chat.messages) {
						chat.messages.forEach(m => {
							if (!m.isRead && shouldMark(m)) m.isRead = true;
						});
					}
				})
			);
		});

		socket.on('messageDeleted', (raw) => {
			const data = raw?.message ?? raw?.data ?? raw;
			const chatId = String(data?.chatId ?? '');
			const messageId = String(data?.messageId ?? data?.id ?? data?._id ?? '');
			if (!chatId || !messageId) return;
			
			// Optimistically remove message from the active chat thread
			dispatch(
				apiSlice.util.updateQueryData('getChatMessages', chatId, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.messages || []);
					const index = arr.findIndex((m) => String(m.id || m._id) === messageId);
					if (index !== -1) arr.splice(index, 1);
				})
			);

			// Optimistically remove message from the chats list
			dispatch(
				apiSlice.util.updateQueryData('getChats', undefined, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.chats || []);
					const chat = arr.find((c) => String(c.id || c._id) === chatId);
					if (chat && chat.messages) {
						const index = chat.messages.findIndex((m) => String(m.id || m._id) === messageId);
						if (index !== -1) chat.messages.splice(index, 1);
					}
				})
			);
		});

		return () => {
			socket.close();
		};
	}, [userInfo?.id, userInfo?._id, dispatch, setNotifToast]);

	// Join a chat room
	const joinChat = (chatId) => {
		if (chatSocket && chatId) {
			chatSocket.emit('joinChat', { chatId });
		}
	};

	// Send a message
	const sendChatMessage = (chatId, content) => {
		if (chatSocket && chatId && content) {
			chatSocket.emit('sendMessage', {
				chatId,
				senderId: userInfo?.id || userInfo?._id,
				senderType: 'AGENT',
				content
			});
		}
	};

	// Mark chat as read
	const markChatAsReadSocket = (chatId) => {
		if (chatSocket && chatId) {
			chatSocket.emit('markAsRead', { chatId });
		}
	};

	return (
		<ChatContext.Provider
			value={{
				chatSocket,
				joinChat,
				sendChatMessage,
				markChatAsReadSocket
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export function useChat() {
	return useContext(ChatContext);
}
