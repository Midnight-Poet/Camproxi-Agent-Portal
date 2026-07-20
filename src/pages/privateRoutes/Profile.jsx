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

import ProfileRow from '../../components/settings/ProfileRow';

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
				<div className='flex-1 overflow-y-auto mt-5 scrollbar-hide'>
					<div className='px-4 sm:px-6 pb-10 pt-2 flex sm:flex-row flex-col w-full gap-5 sm:gap-6 items-start max-w-5xl mx-auto'>
						{/* Identity card */}
						<div className='w-full sm:w-1/3 glass-heavy rounded-[24px] border border-white/60 shadow-sm p-6 text-center mb-4 transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden group'>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<div className='inline-block relative z-10'>
								<Avatar name={agentName} size={88} url={profileImg} />
								<div className='absolute -bottom-0.5 -right-0.5 w-[26px] h-[26px] rounded-full bg-primary border-[3px] border-white flex items-center justify-center'>
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
										<div className='font-black text-[20px] tracking-tight text-ink'>
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
							<div className='text-[11px] font-black tracking-[0.1em] uppercase text-primary mb-3 pl-1'>
								Account
							</div>
							<div className='glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden mb-6'>
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
								{/* <ProfileRow
									icon='tag'
									label='Payout details'
									onClick={() => navigate('/profile/payout')}
								/> */}
								<ProfileRow
									icon='bell'
									label='Notification settings'
									onClick={() =>
										navigate('/profile/notifications')
									}
								/>
								{/* <ProfileRow
									icon='chat'
									label='Reviews & Ratings'
									last
									onClick={() =>
										navigate('/profile/reviews')
									}
								/> */}
							</div>

							<div className='text-[11px] font-black tracking-[0.1em] uppercase text-primary mb-3 pl-1'>
								Support
							</div>
							<div className='glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden mb-6'>
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

							<div className='glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden'>
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
