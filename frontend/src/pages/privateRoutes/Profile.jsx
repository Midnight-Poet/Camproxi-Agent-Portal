import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Avatar from '../../components/Avatar';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';
import { AGENT_LABEL } from '../../data';
import { useLogoutMutation } from '../../redux/api/agentApiSlice';
import { logout } from '../../redux/feautures/auth/authSlice';
import { useDispatch } from 'react-redux';

function ProfileRow({ icon, label, value, danger, onClick, last }) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-3.5 px-[15px] py-3.5 w-full text-left border-none bg-none cursor-pointer hover:bg-bg transition-colors ${last ? '' : 'border-b border-line2'}`}
		>
			<div
				className={`w-9 h-9 rounded-[10px] flex-shrink-0 flex items-center justify-center ${danger ? 'bg-danger-bg text-danger' : 'bg-primary-50 text-primary-700'}`}
			>
				<Icon
					name={icon}
					size={19}
					color={danger ? '#d2453d' : '#084f49'}
				/>
			</div>
			<span
				className={`flex-1 font-bold text-[14.5px] ${danger ? 'text-danger' : 'text-ink'}`}
			>
				{label}
			</span>
			{value && (
				<span className='text-muted text-[13.5px] font-semibold'>
					{value}
				</span>
			)}
			{!danger && <Icon name='chevronRight' size={18} color='#93a4a0' />}
		</button>
	);
}

export default function Profile() {
	const [logoutApiCall] = useLogoutMutation();
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const logoutHandler = async () => {
		try {
			await logoutApiCall().unwrap();
			dispatch(logout());
			navigate('/signin');
		} catch (error) {
			console.error(error);
		}
	};
	const { agentName, agentType, listings, profileImg } = useApp();
	const views = listings?.reduce((s, l) => l.views ? s + l.views : 0, 0);

	return (
		<Layout>
			<div className='flex flex-col h-full'>
				<AppBar title='Profile' sub={'Your account profile and settings'}  />
				<div className='flex-1 overflow-y-auto mt-5'>
					<div className='px-[18px] pb-7 pt-1 flex sm:flex-row flex-col w-full gap-5 items-start'>
						{/* Identity card */}
						<div className='w-full sm:w-1/3 bg-white rounded-card border border-line2 shadow-sm2 p-5 text-center mb-4'>
							<div className='inline-block relative'>
								<Avatar name={agentName} size={88} url={profileImg} />
								<div className='absolute -bottom-0.5 -right-0.5 w-[26px] h-[26px] rounded-full bg-ok border-[3px] border-white flex items-center justify-center'>
									<Icon
										name='check'
										size={13}
										color='#fff'
										stroke={3}
									/>
								</div>
							</div>
							<div className='font-extrabold text-[19px] text-ink mt-3 tracking-[-0.02em]'>
								{agentName}
							</div>
							<div className='inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-bold text-[12.5px]'>
								<Icon name='shield' size={14} color='#084f49' />{' '}
								Verified {AGENT_LABEL[agentType] || 'Agent'}
							</div>
							<div className='flex mt-[18px] pt-4 border-t border-line2'>
								{[
									['Listings', listings?.length],
									['Profile views', views?.toLocaleString()],
									['Rating', '4.9'],
								].map(([k, v], i) => (
									<div
										key={k}
										className={`flex-1 ${i ? 'border-l border-line2' : ''}`}
									>
										<div className='font-extrabold text-[19px] text-ink'>
											{v}
										</div>
										<div className='text-muted text-[12px] font-semibold'>
											{k}
										</div>
									</div>
								))}
							</div>
						</div>
						<div className='w-full sm:w-2/3'>
							<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5'>
								Account
							</div>
							<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-4'>
								<ProfileRow
									icon='user'
									label='Edit profile'
									onClick={() => navigate('/profile/edit')}
								/>
								<ProfileRow
									icon='shield'
									label='Verification'
									value='Verified'
									onClick={() =>
										navigate('/profile/verification')
									}
								/>
								<ProfileRow
									icon='tag'
									label='Payout details'
									onClick={() => navigate('/profile/payout')}
								/>
								<ProfileRow
									icon='bell'
									label='Notification settings'
									last
									onClick={() =>
										navigate('/profile/notifications')
									}
								/>
							</div>

							<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5'>
								Support
							</div>
							<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-4'>
								<ProfileRow
									icon='info'
									label='Help center'
									onClick={() => navigate('/profile/help')}
								/>
								<ProfileRow
									icon='heart'
									label='Send feedback'
									last
									onClick={() =>
										navigate('/profile/feedback')
									}
								/>
							</div>

							<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden'>
								<ProfileRow
									icon='logout'
									label='Log out'
									danger
									last
									onClick={logoutHandler}
								/>
							</div>

							<p className='text-center text-faint text-[12px] mt-[18px]'>
								Camproxi Agent Portal · v1.0
							</p>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
