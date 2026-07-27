import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Avatar from '../../components/Avatar';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { useState } from 'react';
import CreateListing from './CreateListing';
import CreateListing2 from './createListingv2';
import Spark from '../../components/dashboard/Spark';
import StatCard from '../../components/dashboard/StatCard';
import QuickAction from '../../components/dashboard/QuickAction';
import CreateListingModal from '../../components/listings/CreateListingModal';

export default function Dashboard() {
	const navigate = useNavigate();
	const { listings, requests, agentName, username, profileImg } = useApp();
	const [newListing, setNewListing] = useState(false);

	const pending = requests?.filter((r) => r.status === 'pending') || [];
	const views = listings?.reduce((s, l) => s + (l.views || 0), 0) || 0;
	const activeRes = (requests?.filter((r) => r.status === 'accepted')?.length || 0) + 7;

	const stats = [
		{
			key: 'listings',
			value: listings?.length || 0,
			label: 'Total listings',
			icon: 'listings',
			// trend: '+2 this month',
		},
		{
			key: 'res',
			value: activeRes,
			label: 'Active reservations',
			icon: 'calendar',
			// trend: '+3 this week',
		},
		{
			key: 'pending',
			value: pending.length,
			label: 'Pending requests',
			icon: 'requests',
			spark: [3, 5, 4, 6, 8, 7, pending.length + 4],
		},
	];

	return (
		<Layout>
			<div className='flex flex-col h-full bg-bg'>
				<header className='flex-none bg-surface pt-5 pb-4 px-4 sm:pt-7 sm:pb-5 sm:px-6 border-b border-line shadow-sm relative z-20'>
					<div className='flex items-center gap-4'>
						<div className='flex-1 min-w-0'>
							<p className='m-0 text-[11.5px] sm:text-[12.5px] text-primary font-bold uppercase tracking-[0.08em] mb-0.5'>
								Good morning
							</p>
							<h1 className='mt-0 text-[22px] capitalize sm:text-[26px] font-extrabold text-ink tracking-tight truncate'>
								Hi, {username || 'Agent'}
							</h1>
						</div>
						<button
							onClick={() => navigate('/profile')}
							className='cursor-pointer border-none bg-none p-0 hover:scale-105 transition-transform flex-shrink-0'
						>
							<div className="p-0.5 rounded-full bg-primary/10 shadow-sm border border-primary/20">
								<div className="border-[2.5px] border-surface rounded-full overflow-hidden shadow-sm2">
									<Avatar
										name={agentName}
										size={42}
										url={profileImg}
									/>
								</div>
							</div>
						</button>
					</div>
				</header>

				{/* Body */}
				<div className='flex-1 overflow-y-auto scrollbar-hide bg-transparent'>
					<div className='px-4 sm:px-6 pb-10 pt-5 sm:pt-6 animate-fadeUp'>
						{/* Overview */}
						<div className='flex items-baseline justify-between mb-4 sm:mb-5'>
							<h2 className='m-0 text-[16.5px] sm:text-[18.5px] font-extrabold text-ink tracking-tight'>
								Overview
							</h2>
							<span className='text-[12px] sm:text-[12.5px] font-bold text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full'>
								This week
							</span>
						</div>
						{/* Stats — 2 cols on mobile, 4 on lg */}
						<div className='grid grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10'>
							{stats.map((s) => (
								<StatCard
									key={s.key}
									stat={s}
									onClick={() =>
										navigate(
											s.key === 'listings'
												? '/listings'
												: '/requests',
										)
									}
								/>
							))}
						</div>

						{/* Quick actions */}
						<h2 className='m-0 mb-4 sm:mb-5 text-[16.5px] sm:text-[18.5px] font-extrabold text-ink tracking-tight'>
							Quick actions
						</h2>
						<div className='grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-5 mb-8 sm:mb-10'>
							<QuickAction
								icon='plus'
								label='Add Listing'
								sub='Lodge, food, service…'
								primary
								onClick={() => setNewListing(true)}
							/>
							<QuickAction
								icon='requests'
								label='View Requests'
								sub={pending.length + ' waiting'}
								onClick={() => navigate('/requests')}
							/>
						</div>

						{/* Needs attention */}
						<div className='flex items-baseline justify-between mb-4 sm:mb-5'>
							<h2 className='m-0 text-[16.5px] sm:text-[18.5px] font-extrabold text-ink tracking-tight'>
								Needs your attention
							</h2>
							<button
								onClick={() => navigate('/requests')}
								className='text-[13px] font-bold text-primary cursor-pointer border-none bg-none p-0 hover:underline hover:text-primary-700 transition-colors'
							>
								See all
							</button>
						</div>
						<div className='bg-surface rounded-card border border-line shadow-sm2 overflow-hidden flex flex-col'>
							{pending.slice(0, 3).map((r, i) => (
								<div key={r.id} className="relative group">
									{i > 0 && <div className='h-px bg-line/60 mx-4' />}
									<button
										onClick={() => navigate('/requests')}
										className='flex items-center gap-3.5 p-4 w-full text-left cursor-pointer border-none bg-transparent hover:bg-bg transition-colors relative z-10'
									>
										<Avatar
											name={r.name}
											color={r.avatar}
											size={42}
										/>
										<div className='flex-1 min-w-0'>
											<div className='font-bold text-[15px] text-ink group-hover:text-primary transition-colors'>
												{r.name}
											</div>
											<div className='text-muted text-[13px] truncate mt-0.5'>
												wants{' '}
												<strong className='text-ink font-extrabold'>
													{r.listing}
												</strong>
											</div>
										</div>
										<span className='flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-warn/10 text-warn uppercase tracking-wider border border-warn/20'>
											<span className='w-1.5 h-1.5 rounded-full bg-current animate-pulseSoft' />{' '}
											New
										</span>
									</button>
								</div>
							))}
							{pending.length === 0 && (
								<div className='py-8 flex flex-col items-center justify-center text-center'>
									<div className="w-12 h-12 bg-ok/10 text-ok border border-ok/20 rounded-full flex items-center justify-center mb-3">
										<Icon name="check" size={24} stroke={2.5} />
									</div>
									<div className="font-extrabold text-ink text-[15px]">You're all caught up!</div>
									<div className="text-muted text-[13px] mt-1">No pending requests at the moment.</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{newListing && (
				<div className='transition-opacity duration-500 animate-fadeUp fixed top-0 left-0 z-[999] h-screen w-full bg-ink/40 backdrop-blur-sm flex items-center justify-center'>
					<CreateListingModal setState={() => setNewListing(false)} />
				</div>
			)}
		</Layout>
	);
}
