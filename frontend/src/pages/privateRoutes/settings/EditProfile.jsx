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
import { setCredientials } from '../../../redux/feautures/auth/authSlice';

const inputCls =
	'w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 transition-all focus:border-primary placeholder:text-faint';

function Field({ label, opt, children, className }) {
	return (
		<div className={`mb-4  ${className}`}>
			<label
				className={`block capitalize text-[13px] font-bold text-camtext mb-1.5`}
			>
				{label}
				{opt && (
					<span className='text-faint font-semibold'>
						{' '}
						· optional
					</span>
				)}
			</label>
			{children}
		</div>
	);
}

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
		data
			? (setForm({
					firstName: data.firstName,
					lastName: data.lastName,
					username: data.username,
					email: data.email,
					address: data.address,
					phone: data.phone,
					whatsapp: data.whatsapp || 0,
					companyName: data.companyName,
					bio: data.bio,
					facebook: data.socialLinks.facebook,
					instagram: data.socialLinks.instagram,
					twitter: data.socialLinks.twitter,
					profileImage: null,
				}),
				setDisplayImg(data.profileImage))
			: null;
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
		for (const [key, value] of Object.entries(form)) {
			formData.append(key, value);
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
			<div className='flex flex-col h-full'>
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
									className='mt-2.5 px-3 py-2 text-[13px] font-bold text-primary-700 bg-primary-50 rounded-sm2 cursor-pointer hover:bg-primary-100 transition-colors inline-block'
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

							<div className='bg-white flex flex-wrap items-center justify-between gap-2 rounded-card border border-line2 shadow-sm2 p-4'>
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
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
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
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
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
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
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
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
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
										className='w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 resize-none leading-relaxed transition-all focus:border-primary placeholder:text-faint'
										rows={3}
										value={form.bio}
										onChange={set('bio')}
									/>
								</Field>
							</div>
						</div>
					</div>
				</div>

				<div className='flex px-5 py-3.5 bg-white border-t border-line w-full'>
					<button
						className='w-1/3 mx-auto py-4 font-bold text-base text-white bg-primary rounded-md2 cursor-pointer disabled:opacity-45 hover:bg-primary-600 transition-colors'
						style={{
							boxShadow: '0 3px 10px rgba(13,122,114,0.28)',
						}}
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
