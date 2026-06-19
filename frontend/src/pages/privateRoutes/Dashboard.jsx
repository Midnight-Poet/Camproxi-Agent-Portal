import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Avatar from '../../components/Avatar';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import { useState } from 'react';
import CreateListing from './CreateListing';
import CreateListing2 from './createListingv2';

function Spark({ data, color }) {
	const max = Math.max(...data);
	return (
		<div className='flex items-end gap-0.5 h-[22px]' style={{ color }}>
			{data.map((d, i) => (
				<i
					key={i}
					className='flex-1 rounded-sm opacity-90 block'
					style={{
						height: Math.max(12, (d / max) * 100) + '%',
						background: 'currentColor',
					}}
				/>
			))}
		</div>
	);
}

function StatCard({ stat, big, onClick }) {
	const solid = stat.solid;
	return (
		<button
			onClick={onClick}
			className={`text-left cursor-pointer p-${big ? '5' : '4'} flex flex-col gap-${big ? '3.5' : '2'} w-full rounded-card border border-line2 shadow-sm2 transition-all hover:shadow-md2`}
			style={{
				background: solid ? '#0d7a72' : '#fff',
				padding: big ? 20 : 15,
			}}
		>
			<div className='flex items-center justify-between'>
				<div
					style={{
						width: big ? 40 : 34,
						height: big ? 40 : 34,
						borderRadius: 11,
						background: solid
							? 'rgba(255,255,255,0.16)'
							: '#ecf6f5',
						color: solid ? '#fff' : '#084f49',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon
						name={stat.icon}
						size={big ? 22 : 19}
						stroke={1.9}
						color={solid ? '#fff' : '#084f49'}
					/>
				</div>
				{stat.spark && (
					<Spark
						data={stat.spark}
						color={solid ? 'rgba(255,255,255,0.5)' : '#0d7a72'}
					/>
				)}
			</div>
			<div>
				<div
					style={{
						fontSize: big ? 38 : 26,
						fontWeight: 800,
						letterSpacing: '-0.03em',
						color: solid ? '#fff' : '#14201e',
						lineHeight: 1,
					}}
				>
					{stat.value}
				</div>
				<div className='flex items-center gap-1.5 mt-1.5'>
					<span
						style={{
							fontSize: 13,
							fontWeight: 600,
							color: solid ? 'rgba(255,255,255,0.85)' : '#677975',
						}}
					>
						{stat.label}
					</span>
				</div>
			</div>
			{stat.trend && (
				<div
					style={{
						fontSize: 12,
						fontWeight: 700,
						color: solid ? 'rgba(255,255,255,0.9)' : '#1f9d6b',
					}}
				>
					{stat.trend}
				</div>
			)}
		</button>
	);
}

function QuickAction({ icon, label, sub, onClick, primary }) {
	return (
		<button
			onClick={onClick}
			className='flex-1 cursor-pointer text-left rounded-card flex flex-col gap-3 transition-all hover:shadow-md2'
			style={{
				padding: '15px',
				background: primary ? '#0d7a72' : '#fff',
				boxShadow: primary
					? '0 6px 16px rgba(13,122,114,0.26)'
					: '0 1px 2px rgba(20,32,30,.05)',
				border: primary ? 'none' : '1px solid #eef3f2',
			}}
		>
			<div
				style={{
					width: 38,
					height: 38,
					borderRadius: 11,
					background: primary ? 'rgba(255,255,255,0.18)' : '#ecf6f5',
					color: primary ? '#fff' : '#084f49',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Icon
					name={icon}
					size={20}
					stroke={2}
					color={primary ? '#fff' : '#084f49'}
				/>
			</div>
			<div>
				<div
					style={{
						fontWeight: 800,
						fontSize: 14.5,
						color: primary ? '#fff' : '#14201e',
					}}
				>
					{label}
				</div>
				<div
					style={{
						fontSize: 12,
						fontWeight: 500,
						color: primary ? 'rgba(255,255,255,0.8)' : '#677975',
						marginTop: 1,
					}}
				>
					{sub}
				</div>
			</div>
		</button>
	);
}

export default function Dashboard() {
	const navigate = useNavigate();
	const { listings, requests, agentName, username, profileImg } = useApp();
	const [newListing, setNewListing] = useState(false);

	const pending = requests?.filter((r) => r.status === 'pending');
	const views = listings?.reduce((s, l) => s + l.views, 0);
	const activeRes =
		requests?.filter((r) => r.status === 'accepted').length + 7;

	const stats = [
		{
			key: 'listings',
			value: listings?.length,
			label: 'Total listings',
			icon: 'listings',
			trend: '+2 this month',
		},
		{
			key: 'res',
			value: activeRes,
			label: 'Active reservations',
			icon: 'calendar',
			trend: '+3 this week',
		},
		{
			key: 'pending',
			value: pending?.length,
			label: 'Pending requests',
			icon: 'requests',
			spark: [3, 5, 4, 6, 8, 7, pending?.length + 4],
		},
		{
			key: 'views',
			value: views?.toLocaleString(),
			label: 'Profile views',
			icon: 'eye',
			trend: '+18% vs last wk',
			spark: [40, 55, 48, 70, 65, 88, 96],
		},
	];

	return (
		<Layout>
			<div className='flex flex-col h-full'>
				{/* Header */}
				<header className='flex-none bg-bg pt-4 pb-3.5 px-[18px] border-none'>
					<div className='flex items-center gap-3'>
						<div className='flex-1'>
							<p className='m-0 text-[13px] text-muted font-medium'>
								Good morning
							</p>
							<h1 className='mt-0.5 text-[23px] font-extrabold text-ink tracking-[-0.02em]'>
								Hi, {username}
							</h1>
						</div>
						<button
							onClick={() => navigate('/profile')}
							className='cursor-pointer border-none bg-none p-0'
						>
							<Avatar
								name={agentName}
								size={42}
								url={profileImg}
							/>
						</button>
					</div>
				</header>

				{/* Body */}
				<div className='flex-1 overflow-y-auto'>
					<div className='px-[18px] pb-7 pt-1 animate-fadeUp'>
						{/* Overview */}
						<div className='flex items-baseline justify-between mb-3.5'>
							<h2 className='m-0 text-base font-extrabold text-ink tracking-[-0.01em]'>
								Overview
							</h2>
							<span className='text-[12.5px] font-bold text-faint'>
								This week
							</span>
						</div>
						<div className='grid grid-cols-2 gap-3 mb-7'>
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
						<h2 className='m-0 mb-3.5 text-base font-extrabold text-ink tracking-[-0.01em]'>
							Quick actions
						</h2>
						<div className='flex gap-3 mb-7'>
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
						<div className='flex items-baseline justify-between mb-3.5'>
							<h2 className='m-0 text-base font-extrabold text-ink tracking-[-0.01em]'>
								Needs your attention
							</h2>
							<button
								onClick={() => navigate('/requests')}
								className='text-[13px] font-bold text-primary cursor-pointer border-none bg-none p-0'
							>
								See all
							</button>
						</div>
						<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden'>
							{pending.slice(0, 3).map((r, i) => (
								<div key={r.id}>
									{i > 0 && <div className='h-px bg-line' />}
									<button
										onClick={() => navigate('/requests')}
										className='flex items-center gap-3 p-3.5 w-full text-left cursor-pointer border-none bg-none hover:bg-bg transition-colors'
									>
										<Avatar
											name={r.name}
											color={r.avatar}
											size={40}
										/>
										<div className='flex-1 min-w-0'>
											<div className='font-bold text-[14.5px] text-ink'>
												{r.name}
											</div>
											<div className='text-muted text-[12.5px] truncate'>
												wants{' '}
												<strong className='text-camtext font-bold'>
													{r.listing}
												</strong>
											</div>
										</div>
										<span className='inline-flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-full bg-warn-bg text-warn'>
											<span className='w-1.5 h-1.5 rounded-full bg-current' />{' '}
											New
										</span>
									</button>
								</div>
							))}
							{pending.length === 0 && (
								<div className='py-6 text-center text-muted text-sm'>
									You're all caught up 🎉
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{newListing && (
				<div className='transition-opacity duration-500 animate-fadeUp fixed top-0 left-0 z-999 h-screen w-full bg-black/20 flex items-center justify-center'>
					<CreateListing2 setState={() => setNewListing(false)} />
				</div>
			)}
		</Layout>
	);
}
