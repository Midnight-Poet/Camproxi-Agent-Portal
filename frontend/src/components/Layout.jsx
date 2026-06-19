import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Toast from './Toast';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';

const TABS = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		icon: 'dashboard',
		path: '/dashboard',
	},
	{ id: 'listings', label: 'Listings', icon: 'listings', path: '/listings' },
	{ id: 'requests', label: 'Requests', icon: 'requests', path: '/requests' },
	{ id: 'messages', label: 'Chat', icon: 'chat', path: '/messages' },
	{ id: 'notifs', label: 'Alerts', icon: 'bell', path: '/notifications' },
	{ id: 'profile', label: 'Profile', icon: 'user', path: '/profile' },
];

function Sidebar({ pendingCount, unreadCount, chatCount }) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { agentName, agentType, profileImg } = useApp();
	const AGENT_LABEL = {
		landlord: 'Landlord',
		business: 'Business Owner',
		provider: 'Service Provider',
	};

	return (
		<aside className='hidden md:flex flex-col w-[250px] flex-shrink-0 bg-white border-r border-line h-full'>
			{/* Logo */}
			<div className='px-6 py-5 border-b border-line'>
				<div className='flex items-center gap-2.5'>
					<div className='w-9 h-9 rounded-[11px] bg-primary flex items-center justify-center shadow-md2'>
						<Icon name='pin' size={18} color='#fff' stroke={2.1} />
					</div>
					<span className='text-[20px] font-extrabold text-ink tracking-[-0.03em]'>
						Camproxi
					</span>
				</div>
			</div>

			{/* Nav */}
			<nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
				{TABS.map((t) => {
					const badge =
						t.id === 'requests'
							? pendingCount
							: t.id === 'notifs'
								? unreadCount
								: t.id === 'messages'
									? chatCount
									: 0;
					const active = pathname.startsWith(t.path);
					return (
						<button
							key={t.id}
							onClick={() => navigate(t.path)}
							className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[11px] cursor-pointer transition-all duration-150 text-left ${
								active
									? 'bg-primary-50 text-primary-700'
									: 'text-muted hover:bg-bg hover:text-camtext'
							}`}
						>
							<div className='relative flex-shrink-0'>
								<Icon
									name={t.icon}
									size={20}
									stroke={active ? 2.1 : 1.8}
									color={active ? '#0d7a72' : 'currentColor'}
								/>
							</div>
							<span
								className={`font-bold text-[14px] ${active ? 'text-primary-700' : ''}`}
							>
								{t.label}
							</span>
							{badge > 0 && (
								<span className='ml-auto -top-1 -right-1 min-w-[14px] h-3.5 px-1 bg-danger text-white text-[9px] font-extrabold flex items-center justify-center rounded-full'>
									{badge}
								</span>
							)}
						</button>
					);
				})}
			</nav>

			{/* Add Listing CTA */}
			<div className='px-3 pb-3'>
				<button
					onClick={() => navigate('/listings/create')}
					className='w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white font-bold text-sm rounded-[11px] cursor-pointer hover:bg-primary-600 transition-colors'
					style={{ boxShadow: '0 3px 10px rgba(13,122,114,0.28)' }}
				>
					<Icon name='plus' size={17} color='#fff' stroke={2.2} /> Add
					Listing
				</button>
			</div>

			{/* Agent footer */}
			<div className='p-4 border-t border-line'>
				<div className='flex items-center gap-3'>
					<Avatar name={agentName} size={36} url={profileImg} />
					<div className='flex-1 min-w-0'>
						<div className='text-[13px] font-bold text-ink truncate'>
							{agentName}
						</div>
						<div className='text-[11.5px] text-primary font-semibold flex items-center gap-1'>
							<Icon name='shield' size={11} /> Verified{' '}
							{AGENT_LABEL[agentType] || 'Agent'}
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

function BottomTabBar({ pendingCount, unreadCount, chatCount }) {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<nav className='md:hidden flex-shrink-0 flex items-stretch bg-white/86 backdrop-blur-xl border-t border-line h-[72px]'>
			{TABS.map((t) => {
				const badge =
					t.id === 'requests'
						? pendingCount
						: t.id === 'notifs'
							? unreadCount
							: t.id === 'messages'
								? chatCount
								: 0;
				const active = pathname.startsWith(t.path);
				return (
					<button
						key={t.id}
						className={`flex-1 flex flex-col items-center justify-center gap-[3px] cursor-pointer border-none bg-none py-1 text-[10.5px] font-bold tracking-[0.005em] transition-colors duration-150 ${active ? 'text-primary' : 'text-faint'}`}
						aria-selected={active}
						onClick={() => navigate(t.path)}
					>
						<div className='relative'>
							<Icon
								name={t.icon}
								size={23}
								stroke={active ? 2.1 : 1.8}
							/>
							{badge > 0 && (
								<span className='absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-danger text-white text-[9.5px] font-extrabold flex items-center justify-center rounded-full'>
									{badge}
								</span>
							)}
						</div>
						{t.label}
					</button>
				);
			})}
		</nav>
	);
}

export default function Layout({ children, hideTabBar }) {
	const { toast, pendingCount, unreadCount, chatCount } = useApp();

	return (
		<div className='flex h-full bg-bg overflow-hidden'>
			<Sidebar
				pendingCount={pendingCount}
				unreadCount={unreadCount}
				chatCount={chatCount}
			/>

			<div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
				<main className='flex-1 overflow-hidden flex flex-col'>
					{children}
				</main>
				{!hideTabBar && (
					<BottomTabBar
						pendingCount={pendingCount}
						unreadCount={unreadCount}
						chatCount={chatCount}
					/>
				)}
			</div>
			<Toast msg={toast} />
		</div>
	);
}
