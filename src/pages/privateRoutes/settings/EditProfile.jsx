import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';
import Avatar from '../../../components/Avatar';
import {
	useGetAgentQuery,
	useUpdateAgentMutation,
} from '../../../redux/api/agentApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../components/Loading';
import Field, { inputCls } from '../../../components/shared/Field';
import { setCredientials } from '../../../redux/feautures/auth/authSlice';

export default function EditProfile() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { flash, agentName } = useApp();
	const { userInfo } = useSelector((state) => state.auth);
	const { data, refetch } = useGetAgentQuery(userInfo._id);
	const [updateUser, { isLoading, isError, isSuccess, error }] =
		useUpdateAgentMutation();
	// const
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		address: '',
		phone: 0,
		whatsapp: 0,
		companyName: '',
		category: '',
		bio: '',
		facebook: '',
		instagram: '',
		twitter: '',
		profileImage: {},
	});
	
	const [displayImg, setDisplayImg] = useState({});
	useEffect(() => {
		if (data) {
			setForm({
				firstName: data.firstName || '',
				lastName: data.lastName || '',
				username: data.username || '',
				email: data.email || '',
				address: data.address || '',
				phone: data.phone || '',
				whatsapp: data.whatsapp || '',
				companyName: data.companyName || '',
				bio: data.bio || '',
				facebook: data.socialLinks?.facebook || '',
				instagram: data.socialLinks?.instagram || '',
				twitter: data.socialLinks?.twitter || '',
				profileImage: null,
			});
			setDisplayImg(data.profileImage || {});
		}
	}, [data]);
	const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
	const handleImage = (file) => {
		setForm({ ...form, profileImage: file });
		const url = URL.createObjectURL(file);
		setDisplayImg({ url: url, public_id: file.name });
		flash('Profile Image Updated');
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		let hasChanges = false;
		
		const originalData = {
			firstName: data?.firstName || '',
			lastName: data?.lastName || '',
			username: data?.username || '',
			email: data?.email || '',
			address: data?.address || '',
			phone: data?.phone || '',
			whatsapp: data?.whatsapp || '',
			companyName: data?.companyName || '',
			bio: data?.bio || '',
			facebook: data?.socialLinks?.facebook || '',
			instagram: data?.socialLinks?.instagram || '',
			twitter: data?.socialLinks?.twitter || '',
		};

		for (const [key, value] of Object.entries(form)) {
			if (key === 'profileImage') {
				if (value instanceof File) {
					formData.append(key, value);
					hasChanges = true;
				}
			} else if (value !== originalData[key]) {
				formData.append(key, value);
				hasChanges = true;
			}
		}

		if (!hasChanges) {
			flash('No changes to save.');
			navigate('/profile');
			return;
		}
		try {
			const res = await updateUser(formData).unwrap();
			dispatch(setCredientials({...res}))
			await refetch()
			flash('User Updated!');
			navigate('/profile');
		} catch (err) {
			flash(err.message);
			console.log(error);
		}
	};

	return (
		<Layout>
			<div className='flex flex-col h-full bg-transparent'>
				<AppBar
					title='Edit profile'
					onBack={() => navigate('/profile')}
				/>
				<div className='flex-1 w-full overflow-y-auto'>
					<div className='w-full sm:w-2/3 mx-auto'>
						<div className='px-[18px] pb-6 pt-4'>
							<div className='flex flex-col items-center mb-6'>
								<div className='relative'>
									<Avatar
										name={agentName}
										url={displayImg?.url}
										size={100}
									/>
									<label
										htmlFor='profilePhotoInput'
										aria-label='Change photo'
										className='absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-primary border-[3px] border-white cursor-pointer flex items-center justify-center hover:brightness-110 transition'
									>
										<Icon
											name='camera'
											size={16}
											color='#fff'
										/>
										<input
											id='profilePhotoInput'
											type='file'
											accept='image/*'
											onChange={(e) =>
												handleImage(e.target.files[0])
											}
											className='hidden'
										/>
									</label>
								</div>
								<label
									htmlFor='profilePhotoInputAlt'
									className='mt-3 px-4 py-2.5 text-[13.5px] font-bold text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[12px] cursor-pointer hover:bg-white transition-all inline-block'
								>
									Change photo
									<input
										id='profilePhotoInputAlt'
										type='file'
										accept='image/*'
										onChange={(e) =>
											handleImage(e.target.files[0])
										}
										className='hidden'
									/>
								</label>
							</div>

							<div className='glass-heavy flex flex-wrap items-center justify-between gap-2 rounded-[24px] border border-white/60 shadow-sm p-5 md:p-6 mb-6'>
								<Field
									label='First name'
									className={`w-[48.5%]`}
								>
									<input
										className={inputCls}
										value={form.firstName}
										onChange={set('firstName')}
									/>
								</Field>
								<Field
									label='last name'
									className={`w-[48.5%]`}
								>
									<input
										className={inputCls}
										value={form.lastName}
										onChange={set('lastName')}
									/>
								</Field>
								<Field label='username' className={`w-[48.5%]`}>
									<input
										className={inputCls}
										value={form.username}
										onChange={set('username')}
									/>
								</Field>
								<Field
									label={`Business / company name`}
									className={`w-[48.5%]`}
								>
									<input
										className={inputCls}
										value={form.companyName}
										onChange={set('companyName')}
									/>
								</Field>
								<Field label='Email' className={`w-full`}>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10'>
											<Icon name='mail' size={17} />
										</span>
										<input
											className={`${inputCls} pl-[38px]`}
											type='email'
											value={form.email}
											onChange={set('email')}
										/>
									</div>
								</Field>
								<Field label='Phone' className={`w-[48.5%]`}>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10'>
											<Icon name='phone' size={17} />
										</span>
										<input
											className={`${inputCls} pl-[38px]`}
											type='tel'
											value={`+234-${form.phone}`}
											onChange={set('phone')}
										/>
									</div>
								</Field>
								<Field label='whatsapp' className={`w-[48.5%]`}>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10'>
											<Icon name='phone' size={17} />
										</span>
										<input
											className={`${inputCls} pl-[38px]`}
											type='tel'
											value={
												form.whatsapp
													? `+234-${form.whatsapp}`
													: ''
											}
											onChange={set('whatsapp')}
										/>
									</div>
								</Field>
								<Field
									label='Area near campus'
									className={`w-full`}
								>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10'>
											<Icon name='pin' size={17} />
										</span>
										<input
											className={`${inputCls} pl-[38px]`}
											value={form.address}
											onChange={set('address')}
										/>
									</div>
								</Field>
								<Field label='About' className={`w-full`}>
									<textarea
										className='w-full text-[14.5px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[16px] px-4 py-3.5 resize-none leading-relaxed transition-all focus:bg-white focus:border-primary focus:ring-[4px] focus:ring-primary/15 hover:bg-white/80 placeholder:text-faint font-medium'
										rows={4}
										value={form.bio}
										onChange={set('bio')}
									/>
								</Field>
							</div>
						</div>
					</div>
				</div>

				<div className='flex px-6 py-4 glass border-t border-white/40 shadow-sm relative z-20 w-full'>
					<button
						className='w-full md:w-1/3 mx-auto py-3.5 font-bold text-[15px] text-white bg-gradient-to-r from-primary to-primary-600 rounded-[16px] cursor-pointer disabled:opacity-45 hover:shadow-glow transition-all'
						onClick={handleSubmit}
					>
						Save changes
					</button>
				</div>
			</div>
			<Loading show={isLoading} msg={'Updating...'} />
		</Layout>
	);
}
