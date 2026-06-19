export const LISTING_TYPES = [
	{ id: 'lodge', label: 'Lodge', icon: 'home', hint: 'Rooms & stays' },
	{ id: 'food', label: 'Food & Drinks', icon: 'fork', hint: 'Meals, cafés' },
	{
		id: 'groceries',
		label: 'Groceries',
		icon: 'bag',
		hint: 'Shops & supplies',
	},
	{ id: 'service', label: 'Service', icon: 'wrench', hint: 'Skilled help' },
];

export const AGENT_TYPES = [
	{
		id: 'landlord',
		label: 'Landlord',
		icon: 'home',
		blurb: 'List lodges, hostels & rooms for students.',
	},
	{
		id: 'business',
		label: 'Business Owner',
		icon: 'bag',
		blurb: 'Sell food, groceries & everyday essentials.',
	},
	{
		id: 'provider',
		label: 'Service Provider',
		icon: 'wrench',
		blurb: 'Offer laundry, repairs, tutoring & more.',
	},
];

export const SEED_LISTINGS = [
	{
		id: 'l1',
		type: 'lodge',
		title: 'Sunrise Self-Contain',
		area: 'Westgate, 4 min to campus',
		price: 320000,
		unit: 'year',
		status: 'active',
		views: 214,
		reqs: 6,
		img: 'Lodge exterior',
		room: 'Self-contain',
		amenities: ['Wi-Fi', 'Water', 'Security'],
	},
	{
		id: 'l2',
		type: 'food',
		title: "Mama T's Kitchen",
		area: 'Behind Faculty of Science',
		price: 1500,
		unit: 'plate',
		status: 'active',
		views: 488,
		reqs: 12,
		img: 'Hot jollof plate',
	},
	{
		id: 'l3',
		type: 'lodge',
		title: 'Cedar Court — 1 Bedroom',
		area: 'Oluyole Estate, 9 min',
		price: 550000,
		unit: 'year',
		status: 'pending',
		views: 37,
		reqs: 1,
		img: 'Bedroom interior',
		room: '1 Bedroom',
		amenities: ['Wi-Fi', 'Prepaid', 'Parking'],
	},
	{
		id: 'l4',
		type: 'service',
		title: 'CleanFold Laundry',
		area: 'Pickup near South Gate',
		price: 2000,
		unit: 'bag',
		status: 'active',
		views: 156,
		reqs: 4,
		img: 'Laundry service',
		category: 'Laundry & Dry-clean',
	},
	{
		id: 'l5',
		type: 'groceries',
		title: 'Campus Mini Mart',
		area: 'Tanke Junction',
		price: 0,
		unit: 'shop',
		status: 'taken',
		views: 92,
		reqs: 0,
		img: 'Grocery shelf',
	},
	{
		id: 'l6',
		type: 'lodge',
		title: 'Palm View Shared Room',
		area: 'Safari Area, 6 min',
		price: 180000,
		unit: 'year',
		status: 'active',
		views: 301,
		reqs: 9,
		img: 'Shared room',
		room: 'Shared (2)',
		amenities: ['Wi-Fi', 'Water'],
	},

	{
		id: 'l7',
		type: 'lodge',
		title: ' View Shared Room',
		area: 'Safari Area, 6 min',
		price: 180000,
		unit: 'year',
		status: 'active',
		views: 301,
		reqs: 9,
		img: 'Shared room',
		room: 'Shared (2)',
		amenities: ['Wi-Fi', 'Water'],
	},
];

export const SEED_REQUESTS = [
	{
		id: 'r1',
		name: 'Amaka Obi',
		listing: 'Sunrise Self-Contain',
		type: 'lodge',
		when: 'Today, 9:24 AM',
		note: 'Can I move in before the new semester?',
		status: 'pending',
		avatar: '#0d7a72',
	},
	{
		id: 'r2',
		name: 'Tunde Bakare',
		listing: "Mama T's Kitchen",
		type: 'food',
		when: 'Today, 8:02 AM',
		note: 'Do you deliver to Tanke?',
		status: 'pending',
		avatar: '#c8821a',
	},
	{
		id: 'r3',
		name: 'Grace Eze',
		listing: 'Palm View Shared Room',
		type: 'lodge',
		when: 'Yesterday',
		note: 'Is the second slot still open?',
		status: 'pending',
		avatar: '#7a5ae0',
	},
	{
		id: 'r4',
		name: 'Ibrahim Sani',
		listing: 'CleanFold Laundry',
		type: 'service',
		when: 'Yesterday',
		note: 'Weekly pickup for 1 semester.',
		status: 'pending',
		avatar: '#1f9d6b',
	},
	{
		id: 'r5',
		name: 'Chioma N.',
		listing: 'Sunrise Self-Contain',
		type: 'lodge',
		when: 'Mon',
		note: 'Accepted — keys handed over.',
		status: 'accepted',
		avatar: '#d2453d',
	},
	{
		id: 'r6',
		name: 'Femi Adeyemi',
		listing: 'Cedar Court — 1 Bedroom',
		type: 'lodge',
		when: 'Sun',
		note: '',
		status: 'declined',
		avatar: '#2b6fdb',
	},
];

export const SEED_NOTIFS = [
	{
		id: 'n1',
		kind: 'request',
		title: 'New reservation request',
		body: 'Amaka Obi is interested in Sunrise Self-Contain.',
		when: '12m ago',
		unread: true,
	},
	{
		id: 'n2',
		kind: 'approved',
		title: 'Listing approved',
		body: '"Palm View Shared Room" is now live and visible to students.',
		when: '2h ago',
		unread: true,
	},
	{
		id: 'n3',
		kind: 'view',
		title: 'Your listings are trending',
		body: "Mama T's Kitchen got 60 new views this week.",
		when: '1d ago',
		unread: false,
	},
	{
		id: 'n4',
		kind: 'pending',
		title: 'Verification under review',
		body: 'Cedar Court — 1 Bedroom is pending approval (usually < 24h).',
		when: '1d ago',
		unread: false,
	},
	{
		id: 'n5',
		kind: 'system',
		title: 'Tip: add more photos',
		body: 'Listings with 4+ photos get 2× more requests.',
		when: '3d ago',
		unread: false,
	},
];

export const SEED_CHATS = [
	{
		id: 'c1',
		name: 'Amaka Obi',
		avatar: '#0d7a72',
		listing: 'Sunrise Self-Contain',
		when: '9:31 AM',
		unread: 2,
		online: true,
		messages: [
			{
				from: 'them',
				text: 'Hi! Is the Sunrise self-contain still available for the new semester?',
				when: '9:24 AM',
			},
			{
				from: 'me',
				text: 'Hi Amaka, yes it is — move-in can be as early as next week.',
				when: '9:27 AM',
			},
			{
				from: 'them',
				text: 'That works for me. Can I move in before the semester starts?',
				when: '9:30 AM',
			},
			{
				from: 'them',
				text: 'Also, is the security deposit refundable?',
				when: '9:31 AM',
			},
		],
	},
	{
		id: 'c2',
		name: 'Tunde Bakare',
		avatar: '#c8821a',
		listing: "Mama T's Kitchen",
		when: '8:05 AM',
		unread: 0,
		online: true,
		messages: [
			{
				from: 'them',
				text: 'Do you deliver to Tanke junction?',
				when: '8:02 AM',
			},
			{
				from: 'me',
				text: 'Yes! Delivery to Tanke is ₦300, usually under 30 mins.',
				when: '8:05 AM',
			},
		],
	},
	{
		id: 'c3',
		name: 'Grace Eze',
		avatar: '#7a5ae0',
		listing: 'Palm View Shared Room',
		when: 'Yesterday',
		unread: 0,
		online: false,
		messages: [
			{
				from: 'them',
				text: 'Is the second slot in the shared room still open?',
				when: 'Yesterday',
			},
			{
				from: 'me',
				text: 'It is — would you like to schedule a viewing this weekend?',
				when: 'Yesterday',
			},
			{
				from: 'them',
				text: 'Saturday morning would be perfect, thank you!',
				when: 'Yesterday',
			},
		],
	},
	{
		id: 'c4',
		name: 'Ibrahim Sani',
		avatar: '#1f9d6b',
		listing: 'CleanFold Laundry',
		when: 'Yesterday',
		unread: 1,
		online: false,
		messages: [
			{
				from: 'them',
				text: 'I want a weekly pickup for the full semester. What are your rates?',
				when: 'Yesterday',
			},
		],
	},
	{
		id: 'c5',
		name: 'Chioma N.',
		avatar: '#d2453d',
		listing: 'Sunrise Self-Contain',
		when: 'Mon',
		unread: 0,
		online: false,
		messages: [
			{
				from: 'them',
				text: 'Thank you for handing over the keys so quickly!',
				when: 'Mon',
			},
			{
				from: 'me',
				text: "You're welcome Chioma — enjoy the new place. Reach out anytime.",
				when: 'Mon',
			},
		],
	},
];

export const AMENITIES = [
	'Wi-Fi',
	'Water',
	'Prepaid meter',
	'Security',
	'Parking',
	'Kitchen',
	'En-suite',
	'Furnished',
];
export const ROOM_TYPES = [
	'Shared room',
	'Self-contain',
	'1 Bedroom',
	'2 Bedroom',
	'Whole apartment',
];
export const SERVICE_CATS = [
	'Laundry & Dry-clean',
	'Repairs & Handyman',
	'Tutoring',
	'Hair & Beauty',
	'Printing & Errands',
	'Transport',
];
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const PRICE_UNIT = {
	lodge: 'year',
	food: 'plate',
	groceries: 'item',
	service: 'job',
};

export const TYPE_LABEL = {
	lodge: 'Lodge',
	food: 'Food & Drinks',
	groceries: 'Groceries',
	service: 'Service',
};

export const AGENT_LABEL = {
	landlord: 'Landlord',
	business: 'Business Owner',
	provider: 'Service Provider',
};

export function fmtMoney(n) {
	return '₦' + Number(n).toLocaleString();
}

export function priceLine(l) {
	if (l.price === 0) return TYPE_LABEL[l.type];
	return fmtMoney(l.price) + (l.unit === 'year' ? '/yr' : l.uni? ' /' + l.unit : '');
}
