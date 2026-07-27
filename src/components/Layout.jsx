import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Toast from './Toast';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import NotificationToast from './NotificationToast';

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
		<aside className='hidden md:flex flex-col w-[260px] flex-shrink-0 bg-surface rounded-card shadow-sm2 border border-line h-full relative z-10'>
			{/* Logo */}
			<div className='px-6 py-5 border-b border-line'>
				<div className='flex items-center gap-2.5'>
					<div className='w-9 h-9 rounded-[11px] bg-primary flex items-center justify-center shadow-sm'>
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
							className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 text-left relative group mb-1 ${
								active
									? 'bg-primary/5 shadow-sm border border-primary/10'
									: 'hover:bg-bg border border-transparent'
							}`}
						>
							{active && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-primary rounded-r-full" />
							)}
							<div className={`relative flex-shrink-0 w-[34px] h-[34px] flex items-center justify-center rounded-lg transition-all duration-300 ${
								active 
									? 'bg-primary text-white shadow-sm' 
									: 'bg-transparent text-muted group-hover:bg-surface group-hover:shadow-sm group-hover:text-primary group-hover:border group-hover:border-line'
							}`}>
								<Icon
									name={t.icon}
									size={active ? 17 : 18}
									stroke={active ? 2.2 : 1.9}
									color="currentColor"
								/>
							</div>
							<span
								className={`font-bold text-[14.5px] tracking-[-0.01em] transition-all duration-300 ${active ? 'text-ink' : 'text-muted group-hover:text-ink'}`}
							>
								{t.label}
							</span>
							{badge > 0 && (
								<div className={`ml-auto min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full text-[11px] font-black tracking-tight border transition-all duration-300 ${
									active 
										? 'bg-surface border-line text-primary shadow-sm' 
										: 'bg-danger text-white shadow-sm border-danger'
								}`}>
									{badge > 99 ? '99+' : badge}
								</div>
							)}
						</button>
					);
				})}
			</nav>

			{/* Add Listing CTA */}
			<div className='px-3 pb-3'>
				<button
					onClick={() => navigate('/listings')}
					className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-bold text-sm rounded-md2 cursor-pointer hover:bg-primary-600 transition-all duration-300 shadow-sm'
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
		<nav className='md:hidden flex-shrink-0 flex items-stretch bg-surface shadow-[0_-4px_24px_rgba(20,32,30,0.06)] border-t border-line h-[72px] pb-[env(safe-area-inset-bottom)]'>
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
						className={`flex-1 flex flex-col items-center justify-center gap-[4px] cursor-pointer border-none bg-transparent py-1 text-[10.5px] font-bold tracking-[0.005em] transition-all duration-300 relative group ${active ? 'text-primary' : 'text-muted hover:text-ink'}`}
						aria-selected={active}
						onClick={() => navigate(t.path)}
					>
						<div className={`relative w-[32px] h-[32px] flex items-center justify-center rounded-[10px] transition-all duration-300 ${
							active 
								? 'bg-primary text-white shadow-sm scale-[1.05]' 
								: 'bg-transparent text-muted group-hover:bg-bg'
						}`}>
							<Icon
								name={t.icon}
								size={18}
								stroke={active ? 2.2 : 1.9}
								color="currentColor"
							/>
							{badge > 0 && (
								<div className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[9px] font-black tracking-tight border-[1.5px] border-surface transition-all duration-300 ${
									active 
										? 'bg-surface text-primary border-line shadow-sm' 
										: 'bg-danger text-white shadow-sm border-danger'
								}`}>
									{badge > 99 ? '99+' : badge}
								</div>
							)}
						</div>
						<span className={active ? 'opacity-100' : 'opacity-80'}>{t.label}</span>
					</button>
				);
			})}
		</nav>
	);
}

export default function Layout({ children, hideTabBar }) {
	const { toast, pendingCount, unreadCount, chatCount, notifToast, setNotifToast } = useApp();

	return (
		<div className='flex h-full bg-bg overflow-hidden md:p-4 md:gap-4'>
			<Sidebar
				pendingCount={pendingCount}
				unreadCount={unreadCount}
				chatCount={chatCount}
			/>

			<div className='flex-1 flex flex-col min-w-0 overflow-hidden bg-bg relative z-10'>
				<main className='flex-1 overflow-hidden flex flex-col rounded-[24px]'>
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
			<NotificationToast toast={notifToast} onClose={() => setNotifToast(null)} />
		</div>
	);
}
