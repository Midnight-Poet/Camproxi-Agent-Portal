import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { SEED_LISTINGS, SEED_REQUESTS, SEED_NOTIFS, SEED_CHATS } from '../data';
import { useSelector } from 'react-redux';
import { useGetAllProductQuery } from '../redux/api/productApiSlice';
import { useGetAllPropertyQuery } from '../redux/api/propertyApiSlice';
import { useGetAllServiceQuery } from '../redux/api/serviceApiSlice';
import { useGetAgentRequestsQuery, useRespondToRequestMutation } from '../redux/api/requestsApiSlice';
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from '../redux/api/notificationsApiSlice';

const AppContext = createContext(null);

export function AppProvider({ children }) {
	const { userInfo } = useSelector((state) => state.auth);
	const category = userInfo?.category;
	const { data, refetch } = useGetAllProductQuery();
	const { data: propertyData, refetch: refetchProperty } =
		useGetAllPropertyQuery();
	const { data: serviceData, refetch: refetchService } =
		useGetAllServiceQuery();
	const { data: requestsData } = useGetAgentRequestsQuery(undefined, { skip: !userInfo, pollingInterval: 1000 });
	const { data: notificationsData, isLoading: isLoadingNotifs } = useGetNotificationsQuery(undefined, { skip: !userInfo, pollingInterval: 1000 });

	const [respondToRequest] = useRespondToRequestMutation();
	const [markNotificationRead] = useMarkNotificationReadMutation();
	const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

	const [listings, setListings] = useState([]);
	const requests = (requestsData ?? []).map((r) => {
		const item = listings.find((l) => String(l.id || l._id) === String(r.itemId)) || {};
		return {
			id: r.id || r._id,
			status: r.status === 'PENDING' ? 'pending' : r.status === 'APPROVED' ? 'accepted' : 'declined',
			name: `${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim() || 'Student',
			avatarUrl: r.student?.profileImage?.url,
			when: r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '',
			type: r.itemCategory === 'PROPERTY' ? 'lodge' : r.itemCategory === 'SERVICE' ? 'service' : 'bag', // bag for product
			listing: item.title || item.name || 'a listing',
			note: r.message,
		};
	});
	const notifs = notificationsData ?? [];
	const [chats, setChats] = useState(SEED_CHATS);
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
			const prevIds = new Set(prevNotifsRef.current.map(n => n.id || n._id));
			const newNotifs = notificationsData.filter(n => !(prevIds.has(n.id || n._id)));
			
			if (newNotifs.length > 0) {
				const latest = newNotifs[0];
				setNotifToast({
					title: 'New Notification',
					msg: latest.message || 'You have a new notification',
					icon: 'bell'
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
			const prevIds = new Set(prevRequestsRef.current.map(n => n.id || n._id));
			const newReqs = requestsData.filter(n => !(prevIds.has(n.id || n._id)));
			
			if (newReqs.length > 0) {
				const latest = newReqs[0];
				setNotifToast({
					title: 'New Request',
					msg: latest.message || 'You received a new request',
					icon: 'requests'
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
				data: { status: status === 'accepted' ? 'APPROVED' : 'REJECTED' }
			}).unwrap();
			flash(status === 'accepted' ? 'Request accepted' : 'Request declined');
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

	const openChatThread = (id) => {
		setChats((cs) =>
			cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
		);
	};

	const sendChat = (id, text) => {
		setChats((cs) =>
			cs.map((c) =>
				c.id === id
					? {
							...c,
							messages: [
								...c.messages,
								{ from: 'me', text, when: 'Now' },
							],
							when: 'Now',
						}
					: c,
			),
		);
	};

	const pendingCount = requests.filter((r) => r.status === 'pending').length;
	const unreadCount = notifs.filter((n) => n.read !== true && n.isRead !== true).length;
	const chatCount = chats.reduce((s, c) => s + c.unread, 0);

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
