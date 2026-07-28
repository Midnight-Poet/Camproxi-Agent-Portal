import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { SEED_LISTINGS, SEED_REQUESTS, SEED_NOTIFS } from '../data';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllProductQuery } from '../redux/api/productApiSlice';
import { useGetAllPropertyQuery } from '../redux/api/propertyApiSlice';
import { useGetAllServiceQuery } from '../redux/api/serviceApiSlice';
import {
	useGetAgentRequestsQuery,
	useRespondToRequestMutation,
} from '../redux/api/requestsApiSlice';
import {
	useGetNotificationsQuery,
	useMarkNotificationReadMutation,
	useMarkAllNotificationsReadMutation,
} from '../redux/api/notificationsApiSlice';
import { useGetChatsQuery } from '../redux/api/chatApiSlice';
import { apiSlice } from '../redux/api/apiSlice';
import { BASE_URL } from '../redux/feautures/constants';
import io from 'socket.io-client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const category = userInfo?.category;
	const { data, refetch } = useGetAllProductQuery();
	const { data: propertyData, refetch: refetchProperty } =
		useGetAllPropertyQuery();
	const { data: serviceData, refetch: refetchService } =
		useGetAllServiceQuery();
	const { data: requestsData } = useGetAgentRequestsQuery(undefined, {
		skip: !userInfo,
		pollingInterval: 1000,
	});
	const { data: notificationsData, isLoading: isLoadingNotifs } =
		useGetNotificationsQuery(undefined, {
			skip: !userInfo,
			pollingInterval: 1000,
		});

	const [respondToRequest] = useRespondToRequestMutation();
	const [markNotificationRead] = useMarkNotificationReadMutation();
	const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

	const [listings, setListings] = useState([]);
	const requests = (requestsData ?? []).map((r) => {
		const item =
			listings.find((l) => String(l.id || l._id) === String(r.itemId)) ||
			{};
		return {
			id: r.id || r._id,
			status:
				r.status === 'PENDING'
					? 'pending'
					: r.status === 'APPROVED'
						? 'accepted'
						: 'declined',
			name:
				`${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim() ||
				'Student',
			avatarUrl: r.student?.profileImage?.url,
			when: r.createdAt
				? new Date(r.createdAt).toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
					})
				: '',
			type:
				r.itemCategory === 'PROPERTY'
					? 'lodge'
					: r.itemCategory === 'SERVICE'
						? 'service'
						: 'bag', // bag for product
			listing: item.title || item.name || 'a listing',
			note: r.message,
			studentId: r.studentId || r.student?.id || r.student?._id,
		};
	});
	const notifs = notificationsData ?? [];
	const { data: chatsData } = useGetChatsQuery(undefined, {
		skip: !userInfo,
		pollingInterval: 1000,
	});
	const chats = chatsData ?? [];
	const [passwordValid, isPasswordValid] = useState();
	const [toast, setToast] = useState('');
	const agentType = userInfo?.category || '';
	const agentName = `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`;
	const username = userInfo?.username || '';
	const profileImg = userInfo?.profileImage?.url || null;

	const [notifToast, setNotifToast] = useState(null);
	const prevNotifsRef = useRef([]);

	useEffect(() => {
		if (notificationsData && prevNotifsRef.current.length > 0) {
			const prevIds = new Set(
				prevNotifsRef.current.map((n) => n.id || n._id),
			);
			const newNotifs = notificationsData.filter(
				(n) => !prevIds.has(n.id || n._id),
			);

			if (newNotifs.length > 0) {
				const latest = newNotifs[0];
				setNotifToast({
					title: 'New Notification',
					msg: latest.message || 'You have a new notification',
					icon: 'bell',
				});
			}
		}
		if (notificationsData) {
			prevNotifsRef.current = notificationsData;
		}
	}, [notificationsData]);

	const prevRequestsRef = useRef([]);

	useEffect(() => {
		if (requestsData && prevRequestsRef.current.length > 0) {
			const prevIds = new Set(
				prevRequestsRef.current.map((n) => n.id || n._id),
			);
			const newReqs = requestsData.filter(
				(n) => !prevIds.has(n.id || n._id),
			);

			if (newReqs.length > 0) {
				const latest = newReqs[0];
				setNotifToast({
					title: 'New Request',
					msg: latest.message || 'You received a new request',
					icon: 'requests',
				});
			}
		}
		if (requestsData) {
			prevRequestsRef.current = requestsData;
		}
	}, [requestsData]);

	useEffect(() => {
		if (!category) return;
		if (category === 'VENDOR') setListings(data ?? []);
		else if (category === 'AGENT') setListings(propertyData ?? []);
		else setListings(serviceData ?? []);
	}, [category, data, propertyData, serviceData]);

	const flash = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(''), 2000);
	};

	const saveListing = (data) => {
		if (data.id) {
			setListings((ls) =>
				ls.map((l) => (l.id === data.id ? { ...l, ...data } : l)),
			);
			flash('Listing updated');
		} else {
			setListings((ls) => [
				{
					...data,
					id: 'l' + Date.now(),
					status: 'pending',
					views: 0,
					reqs: 0,
				},
				...ls,
			]);
			flash('Listing submitted for approval');
		}
	};

	const deleteListing = (id) => {
		setListings((ls) => ls.filter((l) => l.id !== id));
		flash('Listing deleted');
	};

	const actRequest = async (id, status) => {
		try {
			await respondToRequest({
				id,
				data: {
					status: status === 'accepted' ? 'APPROVED' : 'REJECTED',
				},
			}).unwrap();
			flash(
				status === 'accepted' ? 'Request accepted' : 'Request declined',
			);
		} catch (error) {
			flash('Failed to respond to request.');
		}
	};

	const passwordValidation = (type) => {
		// isPasswordValid(status);
		// !passwordValid
		flash(
			type === 'length'
				? 'Password must be at least 8 characters'
				: type === 'mismatch'
					? 'Password does not match'
					: 'Password should contain capital letters',
		);
		// : null;
	};
	const loginValidation = (msg) => {
		flash(msg);
	};
	const formValidation = (status) => {
		flash(
			status ? 'Fill in all the compulsory fields to continue' : 'welps',
		);
	};

	const clearNotifs = async () => {
		try {
			await markAllNotificationsRead().unwrap();
		} catch (error) {
			flash('Failed to clear notifications.');
		}
	};

	const markNotifRead = async (id) => {
		try {
			await markNotificationRead(id).unwrap();
		} catch (error) {
			flash('Failed to mark notification as read.');
		}
	};

	// Socket.IO state
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (userInfo) {
			const newSocket = io(BASE_URL ? `${BASE_URL}/chat` : '/chat', {
				withCredentials: true,
				transports: ['websocket', 'polling'],
			});
			setSocket(newSocket);

			newSocket.on('newMessage', (msg) => {
				// We can handle new message events to show a toast,
				// RTK Query polling or cache invalidation should handle the rest.
				if (msg?.chatId) {
					dispatch(
						apiSlice.util.invalidateTags([
							'Chats',
							{ type: 'ChatMessages', id: msg.chatId },
						]),
					);
				} else {
					dispatch(apiSlice.util.invalidateTags(['Chats']));
				}
			});

			newSocket.on('messagesRead', (payload) => {
				if (payload?.chatId) {
					dispatch(
						apiSlice.util.invalidateTags([
							'Chats',
							{ type: 'ChatMessages', id: payload.chatId },
						]),
					);
				}
			});

			return () => newSocket.close();
		}
	}, [userInfo, dispatch]);

	const openChatThread = (id) => {
		if (socket) {
			socket.emit('joinChat', { chatId: id });
			socket.emit('markAsRead', { chatId: id });
		}
	};

	const sendChat = (id, text) => {
		if (socket && userInfo) {
			socket.emit('sendMessage', {
				chatId: id,
				senderId: userInfo.id || userInfo._id,
				senderType: 'AGENT',
				content: text,
			});
		}
	};

	const pendingCount = requests.filter((r) => r.status === 'pending').length;
	const unreadCount = notifs.filter(
		(n) => n.read !== true && n.isRead !== true,
	).length;
	// Calculate total unread chats if the API provides an unread field on the chat object.
	const chatCount = chats.reduce((s, c) => {
		const unread = (c.messages || []).filter(
			(m) => m.senderType === 'STUDENT' && !m.isRead,
		).length;
		return s + unread;
	}, 0);

	return (
		<AppContext.Provider
			value={{
				listings,
				requests,
				notifs,
				chats,
				toast,
				flash,
				agentType,
				agentName,
				profileImg,
				username,
				notifToast,
				setNotifToast,
				saveListing,
				deleteListing,
				isLoadingNotifs,
				actRequest,
				clearNotifs,
				markNotifRead,
				openChatThread,
				sendChat,
				pendingCount,
				unreadCount,
				chatCount,
				passwordValidation,
				formValidation,
				loginValidation,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
