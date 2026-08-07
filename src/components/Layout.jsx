import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Toast from './Toast';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
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
	{ id: 'messages', label: 'Messages', icon: 'chat', path: '/messages' },
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
		<aside className='hidden md:block w-[88px] lg:w-[260px] flex-shrink-0 relative z-40'>
			<div className='absolute top-0 left-0 h-full bg-surface rounded-card border border-line flex flex-col overflow-hidden transition-all duration-300 z-50 group w-[88px] hover:w-[260px] lg:!w-[260px] shadow-sm2 hover:shadow-[4px_0_24px_rgba(0,0,0,0.12)] lg:hover:shadow-sm2'>
				{/* Logo */}
				<div className='px-5 py-5 border-b border-line flex items-center justify-center lg:justify-start group-hover:justify-start h-[77px] transition-all duration-300'>
					<div className='flex items-center gap-2.5'>
						<div className='w-9 h-9 rounded-[11px] bg-primary flex items-center justify-center shadow-sm flex-shrink-0'>
							<Icon name='pin' size={18} color='#fff' stroke={2.1} />
						</div>
						<span className='text-[20px] font-extrabold text-ink tracking-[-0.03em] opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300 w-0 lg:w-auto group-hover:w-auto overflow-hidden'>
							Camproxi
						</span>
					</div>
				</div>

				{/* Nav */}
				<nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden'>
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
								className={`w-full flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 text-left relative mb-1 justify-center lg:justify-start group-hover:justify-start ${active ? 'bg-primary/5 shadow-sm border border-primary/10' : 'hover:bg-bg border border-transparent'} lg:gap-3 group-hover:gap-3`}
							>
								{active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-primary rounded-r-full" />}
								
								<div className={`relative flex-shrink-0 w-[34px] h-[34px] flex items-center justify-center rounded-lg transition-all duration-300 ${active ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-muted hover:bg-surface hover:shadow-sm hover:text-primary hover:border hover:border-line'}`}>
									<Icon name={t.icon} size={active ? 17 : 18} stroke={active ? 2.2 : 1.9} color="currentColor" />
									
									{/* Badge for Collapsed View */}
									<div className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[9px] font-black tracking-tight border-[1.5px] border-surface bg-danger text-white shadow-sm lg:hidden group-hover:hidden ${badge > 0 ? 'opacity-100' : 'opacity-0'}`}>
										{badge > 99 ? '99+' : badge}
									</div>
								</div>

								{/* Text & Badge for Expanded View */}
								<div className='flex items-center flex-1 min-w-0 opacity-0 lg:opacity-100 group-hover:opacity-100 w-0 lg:w-auto group-hover:w-auto transition-all duration-300 overflow-hidden'>
									<span className={`font-bold text-[14.5px] tracking-[-0.01em] transition-colors duration-300 truncate ${active ? 'text-ink' : 'text-muted'}`}>
										{t.label}
									</span>
									{badge > 0 && (
										<div className={`ml-auto min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full text-[11px] font-black tracking-tight border flex-shrink-0 ${active ? 'bg-surface border-line text-primary shadow-sm' : 'bg-danger text-white shadow-sm border-danger'}`}>
											{badge > 99 ? '99+' : badge}
										</div>
									)}
								</div>
							</button>
						);
					})}
				</nav>

				{/* Add Listing CTA */}
				<div className='px-3 pb-3'>
					<button onClick={() => navigate('/listings')} className={`w-full flex items-center justify-center py-3 bg-primary text-white font-bold text-sm rounded-md2 cursor-pointer hover:bg-primary-600 transition-all duration-300 shadow-sm px-0 lg:px-4 group-hover:px-4 gap-0 lg:gap-2 group-hover:gap-2`}>
						<Icon name='plus' size={17} color='#fff' stroke={2.2} />
						<span className='opacity-0 lg:opacity-100 group-hover:opacity-100 w-0 lg:w-auto group-hover:w-auto overflow-hidden whitespace-nowrap transition-all duration-300'>
							Add Listing
						</span>
					</button>
				</div>

				{/* Agent footer */}
				<div className='p-4 border-t border-line flex items-center justify-center lg:justify-start group-hover:justify-start h-[69px]'>
					<div className='flex items-center gap-3 w-full justify-center lg:justify-start group-hover:justify-start'>
						<div className="flex-shrink-0"><Avatar name={agentName} size={36} url={profileImg} /></div>
						<div className='flex-1 min-w-0 opacity-0 lg:opacity-100 group-hover:opacity-100 w-0 lg:w-auto group-hover:w-auto transition-all duration-300 overflow-hidden'>
							<div className='text-[13px] font-bold text-ink truncate'>{agentName}</div>
							<div className='text-[11.5px] text-primary font-semibold flex items-center gap-1 whitespace-nowrap'>
								<Icon name='shield' size={11} /> Verified {AGENT_LABEL[agentType] || 'Agent'}
							</div>
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
	const [menuOpen, setMenuOpen] = useState(false);

	// The 4 primary tabs split across the center button
	const primaryTabs = [
		{ id: 'dashboard', label: 'Home', icon: 'dashboard', path: '/dashboard' },
		{ id: 'requests', label: 'Requests', icon: 'requests', path: '/requests' },
		{ id: 'messages', label: 'Chats', icon: 'chat', path: '/messages' },
		{ id: 'profile', label: 'Profile', icon: 'user', path: '/profile' },
	];

	const otherTabs = [
		{ id: 'listings', label: 'My Listings', icon: 'listings', path: '/listings' },
		{ id: 'notifs', label: 'Alerts', icon: 'bell', path: '/notifications' },
		{ id: 'settings', label: 'Settings', icon: 'settings', path: '/profile/notifications' },
	];

	const handleNavigate = (path) => {
		setMenuOpen(false);
		navigate(path);
	};

	return (
		<>
			{/* Overlay for Shoot-up Menu */}
			{menuOpen && (
				<div 
					className="md:hidden fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px] transition-opacity animate-fadeIn"
					onClick={() => setMenuOpen(false)}
				/>
			)}

			{/* Shoot-up Menu (Bottom Sheet) */}
			<div className={`md:hidden fixed bottom-[88px] left-4 right-4 z-50 bg-surface rounded-[24px] shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-line overflow-hidden transition-transform duration-300 origin-bottom ${menuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
				<div className="p-2 space-y-1">
					{otherTabs.map((t) => {
						const badge = t.id === 'notifs' ? unreadCount : 0;
						return (
							<button
								key={t.id}
								onClick={() => handleNavigate(t.path)}
								className="w-full flex items-center gap-3 p-3 rounded-[16px] text-left hover:bg-bg transition-colors"
							>
								<div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-ink shadow-sm border border-line">
									<Icon name={t.icon} size={20} stroke={2} />
								</div>
								<span className="font-bold text-[15px] text-ink flex-1">{t.label}</span>
								{badge > 0 && (
									<div className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full text-[11px] font-black tracking-tight bg-danger text-white shadow-sm border border-danger">
										{badge > 99 ? '99+' : badge}
									</div>
								)}
							</button>
						)
					})}
					
					<div className="h-[1px] bg-line mx-3 my-2" />
					
					<button
						onClick={() => handleNavigate('/listings')}
						className="w-full flex items-center gap-3 p-3 rounded-[16px] text-left hover:bg-primary/5 transition-colors group"
					>
						<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20 group-hover:bg-primary-600 transition-colors">
							<Icon name="plus" size={20} stroke={2.5} />
						</div>
						<span className="font-bold text-[15px] text-primary flex-1">Add New Listing</span>
					</button>
				</div>
			</div>

			{/* Bottom Navigation Bar */}
			<nav className='md:hidden flex-shrink-0 flex items-center justify-between px-2 bg-surface shadow-[0_-4px_24px_rgba(20,32,30,0.06)] border-t border-line h-[72px] pb-[env(safe-area-inset-bottom)] relative z-50'>
				
				{/* Left 2 Tabs */}
				<div className="flex-1 flex justify-around">
					{primaryTabs.slice(0, 2).map((t) => {
						const badge = t.id === 'requests' ? pendingCount : 0;
						const active = pathname.startsWith(t.path);
						return (
							<button
								key={t.id}
								className={`flex flex-col items-center justify-center gap-[4px] cursor-pointer border-none bg-transparent py-1 text-[10.5px] font-bold tracking-[0.005em] transition-all duration-300 relative ${active ? 'text-primary' : 'text-muted'}`}
								onClick={() => navigate(t.path)}
							>
								<div className={`relative w-[32px] h-[32px] flex items-center justify-center rounded-[10px] transition-all duration-300 ${active ? 'bg-primary text-white shadow-sm scale-[1.05]' : 'bg-transparent text-muted'}`}>
									<Icon name={t.icon} size={18} stroke={active ? 2.2 : 1.9} color="currentColor" />
									{badge > 0 && (
										<div className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[9px] font-black tracking-tight border-[1.5px] border-surface transition-all duration-300 ${active ? 'bg-surface text-primary border-line' : 'bg-danger text-white border-danger'}`}>
											{badge > 99 ? '99+' : badge}
										</div>
									)}
								</div>
								<span className={active ? 'opacity-100' : 'opacity-80'}>{t.label}</span>
							</button>
						);
					})}
				</div>

				{/* Center Action Button */}
				<div className="relative -top-5 flex-shrink-0 mx-2">
					<button 
						onClick={() => setMenuOpen(!menuOpen)}
						className={`w-[54px] h-[54px] rounded-full flex items-center justify-center text-white shadow-lg border-[3px] border-bg transition-transform duration-300 z-50 ${menuOpen ? 'bg-ink rotate-45 scale-[0.95]' : 'bg-primary hover:bg-primary-600 scale-100'}`}
					>
						<Icon name="plus" size={24} stroke={2.5} />
					</button>
					{unreadCount > 0 && !menuOpen && (
						<div className="absolute top-0 right-0 w-3.5 h-3.5 bg-danger border-2 border-surface rounded-full"></div>
					)}
				</div>

				{/* Right 2 Tabs */}
				<div className="flex-1 flex justify-around">
					{primaryTabs.slice(2, 4).map((t) => {
						const badge = t.id === 'messages' ? chatCount : 0;
						const active = pathname.startsWith(t.path);
						return (
							<button
								key={t.id}
								className={`flex flex-col items-center justify-center gap-[4px] cursor-pointer border-none bg-transparent py-1 text-[10.5px] font-bold tracking-[0.005em] transition-all duration-300 relative ${active ? 'text-primary' : 'text-muted'}`}
								onClick={() => navigate(t.path)}
							>
								<div className={`relative w-[32px] h-[32px] flex items-center justify-center rounded-[10px] transition-all duration-300 ${active ? 'bg-primary text-white shadow-sm scale-[1.05]' : 'bg-transparent text-muted'}`}>
									<Icon name={t.icon} size={18} stroke={active ? 2.2 : 1.9} color="currentColor" />
									{badge > 0 && (
										<div className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[9px] font-black tracking-tight border-[1.5px] border-surface transition-all duration-300 ${active ? 'bg-surface text-primary border-line' : 'bg-danger text-white border-danger'}`}>
											{badge > 99 ? '99+' : badge}
										</div>
									)}
								</div>
								<span className={active ? 'opacity-100' : 'opacity-80'}>{t.label}</span>
							</button>
						);
					})}
				</div>

			</nav>
		</>
	);
}

export default function Layout({ children, hideTabBar }) {
	const { toast, pendingCount, chatCount } = useApp();
	const { unreadCount, notifToast, setNotifToast } = useNotification();

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
				{/* Bottom Tab Bar (Mobile) */}
				{!hideTabBar && (
					<BottomTabBar
						pendingCount={pendingCount}
						unreadCount={unreadCount}
						chatCount={chatCount}
					/>
				)}
			</div>
			{/* Toast Overlays */}
			<Toast msg={toast} />
			<NotificationToast toast={notifToast} onClose={() => setNotifToast(null)} />
		</div>
	);
}
