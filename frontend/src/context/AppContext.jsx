import { createContext, useContext, useEffect, useState } from 'react';
import { SEED_LISTINGS, SEED_REQUESTS, SEED_NOTIFS, SEED_CHATS } from '../data';
import { useSelector } from 'react-redux';
import { useGetAllProductQuery } from '../redux/api/productApiSlice';
import { useGetAllPropertyQuery } from '../redux/api/propertyApiSlice';
import { useGetAllServiceQuery } from '../redux/api/serviceApiSlice';

const AppContext = createContext(null);

export function AppProvider({ children }) {
	const { userInfo } = useSelector((state) => state.auth);
	const category = userInfo?.category;
	const { data, refetch } = useGetAllProductQuery();
	const { data: propertyData, refetch: refetchProperty } =
		useGetAllPropertyQuery();
	const { data: serviceData, refetch: refetchService } =
		useGetAllServiceQuery();
	const [displayedData, setDisplayedData] = useState();
	const [listings, setListings] = useState([]);
	const [requests, setRequests] = useState(SEED_REQUESTS);
	const [notifs, setNotifs] = useState(SEED_NOTIFS);
	const [chats, setChats] = useState(SEED_CHATS);
	const [passwordValid, isPasswordValid] = useState();
	const [toast, setToast] = useState('');
	const [agentType, setAgentType] = userInfo?.category || '';
	const agentName = `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`;
	const username = userInfo?.username || '';
	const profileImg = userInfo?.profileImage?.url || null;

	useEffect(() => {
		category === 'business'
			? setListings(data)
			: category === 'landlord'
				? setListings(propertyData)
				: setListings(serviceData);
	}, [data, propertyData, serviceData]);
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

	const actRequest = (id, status) => {
		setRequests((rs) =>
			rs.map((r) => (r.id === id ? { ...r, status } : r)),
		);
		flash(status === 'accepted' ? 'Request accepted' : 'Request declined');
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

	const clearNotifs = () => {
		setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));
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
	const unreadCount = notifs.filter((n) => n.unread).length;
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
				setAgentType,
				agentName,
				profileImg,
				username,
				saveListing,
				deleteListing,
				actRequest,
				clearNotifs,
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
