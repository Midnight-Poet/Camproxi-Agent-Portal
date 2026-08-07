import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { BASE_URL } from '../redux/feautures/constants';
import { apiSlice } from '../redux/api/apiSlice';
import { useGetNotificationsQuery } from '../redux/api/notificationsApiSlice';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const [notifSocket, setNotifSocket] = useState(null);
	const [notifToast, setNotifToast] = useState(null);

	const { data: notificationsData, isLoading: isLoadingNotifs } = useGetNotificationsQuery(undefined, {
		skip: !userInfo,
	});

	// ─── Socket Connection ───────────────────────────────────────────────
	useEffect(() => {
		if (!userInfo) {
			console.log('[NotifSocket] No userInfo, skipping socket connection');
			return;
		}

		const socketUrl = BASE_URL ? `${BASE_URL}/notifications` : '/notifications';

		const socket = io(socketUrl, {
			withCredentials: true,
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionAttempts: 10,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});

		// ─── Connection lifecycle logging ─────────────────────────────
		socket.on('connect', () => {
			console.log('[NotifSocket] ✅ Connected! Socket ID:', socket.id);
		});

		socket.on('connect_error', (err) => {
			console.error('[NotifSocket] ❌ Connection error:', err.message);
		});

		socket.on('disconnect', (reason) => {
			console.warn('[NotifSocket] ⚠️ Disconnected:', reason);
		});

		socket.on('reconnect', (attempt) => {
			console.log('[NotifSocket] 🔄 Reconnected after', attempt, 'attempts');
		});

		// ─── Notification events ──────────────────────────────────────
		socket.on('newNotification', (raw) => {
			console.log('[NotifSocket] 📬 newNotification received:', raw);
			// Safe extraction: if raw has id/_id, it's the raw notification object itself
			const msg = (raw?.id || raw?._id) ? raw : (raw?.message ?? raw?.data ?? raw);

			// Optimistically add to cache
			dispatch(
				apiSlice.util.updateQueryData('getNotifications', undefined, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.notifications || []);
					const exists = arr.find((n) => String(n.id || n._id) === String(msg.id || msg._id));
					if (!exists) arr.unshift(msg);
				})
			);

			// Chat toast guard: skip if we're already on the messages page
			const isChatNotif =
				msg?.category === 'CHAT' ||
				msg?.type === 'CHAT' ||
				(typeof msg?.title === 'string' && msg.title.toLowerCase().includes('message')) ||
				(typeof msg?.message === 'string' && msg.message.toLowerCase().includes('message')) ||
				(typeof msg?.link === 'string' && msg.link.includes('/messages'));

			if (isChatNotif && window.location.pathname.startsWith('/messages')) {
				console.log('[NotifSocket] Suppressed chat toast (user is on /messages)');
				return;
			}

			// Fire the toast
			console.log('[NotifSocket] 🔔 Firing toast:', msg?.title);
			setNotifToast({
				title: msg?.title || 'New Notification',
				msg: msg?.message || 'You have a new notification',
				icon: 'bell',
				link: msg?.link || null,
			});
		});

		socket.on('notificationRead', (raw) => {
			console.log('[NotifSocket] notificationRead received:', raw);
			const data = raw?.data ?? raw;
			const notifId = data?.notificationId;
			if (!notifId) return;

			dispatch(
				apiSlice.util.updateQueryData('getNotifications', undefined, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.notifications || []);
					const notif = arr.find((n) => String(n.id || n._id) === String(notifId));
					if (notif) notif.isRead = true;
				})
			);
		});

		socket.on('allNotificationsRead', () => {
			console.log('[NotifSocket] allNotificationsRead received');
			dispatch(
				apiSlice.util.updateQueryData('getNotifications', undefined, (draft) => {
					const arr = Array.isArray(draft) ? draft : (draft?.data || draft?.notifications || []);
					arr.forEach((n) => (n.isRead = true));
				})
			);
		});

		setNotifSocket(socket);

		return () => {
			console.log('[NotifSocket] Cleaning up socket');
			socket.close();
		};
	}, [userInfo?.id, userInfo?._id, dispatch]);

	// ─── Socket emitters ─────────────────────────────────────────────────
	const markNotifReadSocket = useCallback(
		(notificationId) => {
			if (notifSocket && notificationId) {
				notifSocket.emit('markAsRead', { notificationId });
			}
		},
		[notifSocket]
	);

	const clearNotifsSocket = useCallback(() => {
		if (notifSocket) {
			notifSocket.emit('markAllAsRead');
		}
	}, [notifSocket]);

	// ─── Derived state ───────────────────────────────────────────────────
	const notifs = Array.isArray(notificationsData)
		? notificationsData
		: notificationsData?.data || notificationsData?.notifications || [];
	const unreadCount = notifs.filter((n) => !n.read && !n.isRead).length;

	return (
		<NotificationContext.Provider
			value={{
				notifs,
				unreadCount,
				isLoadingNotifs,
				notifToast,
				setNotifToast,
				markNotifReadSocket,
				clearNotifsSocket,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotification() {
	return useContext(NotificationContext);
}
