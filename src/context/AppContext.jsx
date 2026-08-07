import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SEED_LISTINGS, SEED_REQUESTS, SEED_NOTIFS } from '../data';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllProductQuery } from '../redux/api/productApiSlice';
import { useGetAllPropertyQuery } from '../redux/api/propertyApiSlice';
import { useGetAllServiceQuery } from '../redux/api/serviceApiSlice';
import {
	useGetAgentRequestsQuery,
	useRespondToRequestMutation,
} from '../redux/api/requestsApiSlice';

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
	});

	const { data: chatsData } = useGetChatsQuery(undefined, { skip: !userInfo });

	const location = useLocation();
	const locationRef = useRef(location);
	useEffect(() => {
		locationRef.current = location;
	}, [location]);

	const [respondToRequest] = useRespondToRequestMutation();

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
						: 'bag',
			listing: item.title || item.name || 'a listing',
			note: r.message,
			studentId: r.studentId || r.student?.id || r.student?._id,
		};
	});


	const [passwordValid, isPasswordValid] = useState();
	const [toast, setToast] = useState('');
	const agentType = userInfo?.category || '';
	const agentName = `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`;
	const username = userInfo?.username || '';
	const profileImg = userInfo?.profileImage?.url || null;

	const prevRequestsRef = useRef([]);
	useEffect(() => {
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
			flash(status === 'accepted' ? 'Request accepted' : 'Request declined');
		} catch (error) {
			flash('Failed to respond to request.');
		}
	};

	const passwordValidation = (type) => {
		flash(
			type === 'length'
				? 'Password must be at least 8 characters'
				: type === 'mismatch'
					? 'Password does not match'
					: 'Password should contain capital letters',
		);
	};
	const loginValidation = (msg) => { flash(msg); };
	const formValidation = (status) => {
		flash(status ? 'Fill in all the compulsory fields to continue' : 'welps');
	};

	// ─── Derived counts ───────────────────────────────────────────────────────

	const pendingCount = requests.filter((r) => r.status === 'pending').length;	
	const chatCount = (chatsData || []).reduce((total, chat) => {
		const unread = (chat.messages || []).filter(m => {
			const isMine = m.senderType === 'AGENT' || m.senderModel === 'AGENT' || m.from === 'me';
			return !isMine && !m.isRead;
		}).length;
		return total + unread;
	}, 0);

	return (
		<AppContext.Provider
			value={{
				listings,
				requests,
				toast,
				flash,
				agentType,
				agentName,
				profileImg,
				username,
				saveListing,
				deleteListing,
				actRequest,
				pendingCount,
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
