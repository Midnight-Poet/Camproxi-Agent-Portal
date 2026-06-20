import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { AGENT_TYPES } from '../../data';
import { useApp } from '../../context/AppContext';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import Toast from '../../components/Toast';
import { useRegisterMutation } from '../../redux/api/agentApiSlice';
import { useDispatch } from 'react-redux';
import { setCredientials } from '../../redux/feautures/auth/authSlice';
import Loading from '../../components/Loading';

function BrandMark({ size = 38 }) {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.3,
				background: '#0d7a72',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 4px 12px rgba(13,122,114,0.32)',
			}}
		>
			<Icon name='pin' size={size * 0.56} color='#fff' stroke={2.1} />
		</div>
	);
}

function AgentTypeCard({ t, selected, onClick }) {
	return (
		<div
			onClick={onClick}
			className={`relative flex sm:flex-col items-center gap-3.5 w-full text-left p-5 rounded-card cursor-pointer mb-3 border-[1.5px] transition-all duration-150 ${
				selected
					? 'border-primary bg-primary-tint shadow-[0_0_0_3px_rgba(13,122,114,0.13)]'
					: 'border-line2 bg-white shadow-sm2'
			}`}
		>
			<div
				className={`w-12 h-12 rounded-[14px] flex-shrink-0 flex items-center justify-center transition-all duration-150 ${
					selected
						? 'bg-primary text-white'
						: 'bg-primary-50 text-primary-700'
				}`}
			>
				<Icon name={t.icon} size={24} stroke={1.9} />
			</div>
			<div className='flex-1 min-w-0 text-center sm:px-2 sm:py-3'>
				<div className='font-extrabold text-base text-ink'>
					{t.label}
				</div>
				<div className='text-sm text-muted mt-0.5'>{t.blurb}</div>
			</div>
			<div
				className={`w-[22px] sm:absolute sm:top-2 sm:right-2 h-[22px] rounded-full flex-shrink-0 flex items-center justify-center ${
					selected
						? 'bg-primary border-0'
						: 'bg-transparent border-2 border-line'
				}`}
			>
				{selected && (
					<Icon name='check' size={14} color='#fff' stroke={3} />
				)}
			</div>
		</div>
	);
}

function Field({ label, opt, children, className }) {
	return (
		<div className={`mb-4 ${className}`}>
			<label className='block capitalize text-[13px] font-bold text-camtext mb-1.5'>
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

function UploadDoc({ file, onUpload }) {
	if (file) {
		return (
			<div
				className='bg-white rounded-card border border-line/30 shadow-sm2 flex items-center gap-3 p-3.5'
				style={{ borderColor: 'rgba(13,122,114,0.3)' }}
			>
				<div className='w-[42px] h-[42px] rounded-[10px] bg-primary-50 text-primary flex items-center justify-center'>
					<Icon name='doc' size={22} />
				</div>
				<div className='flex-1 min-w-0'>
					<div className='font-bold text-sm text-ink truncate'>
						{file}
					</div>
					<div className='text-xs text-ok font-bold flex items-center gap-1 mt-0.5'>
						<Icon name='check' size={13} stroke={3} /> Uploaded
					</div>
				</div>
				<button
					className='px-3 py-2 text-[13.5px] font-bold text-camtext bg-white border border-line rounded-sm2 cursor-pointer'
					onClick={() => onUpload(null)}
				>
					Replace
				</button>
			</div>
		);
	}
	return (
		<button
			type='button'
			onClick={() => onUpload('Govt_ID_verification.pdf')}
			className='w-full cursor-pointer bg-primary-tint rounded-card py-7 px-[18px] text-center flex flex-col items-center gap-2.5'
			style={{ border: '1.5px dashed rgba(13,122,114,0.38)' }}
		>
			<div className='w-12 h-12 rounded-[14px] bg-primary-100 text-primary-700 flex items-center justify-center'>
				<Icon name='upload' size={24} />
			</div>
			<div>
				<div className='font-extrabold text-ink text-[15px]'>
					Upload verification
				</div>
				<div className='text-muted text-[12.5px] mt-0.5'>
					Govt ID, CAC certificate or tenancy proof · PDF/JPG
				</div>
			</div>
		</button>
	);
}

function DesktopBrandPanel() {
	return (
		<div
			className='hidden md:flex flex-col justify-between w-2/5 flex-shrink-0 p-12'
			style={{
				background: 'linear-gradient(160deg, #0d7a72 0%, #084f49 100%)',
			}}
		>
			<div className='flex items-center gap-3'>
				<BrandMark size={44} />
				<span className='text-2xl font-extrabold text-white tracking-[-0.03em]'>
					Camproxi
				</span>
			</div>
			<div>
				<h2 className='text-4xl font-extrabold text-white leading-tight tracking-tight mb-4'>
					List near campus.
					<br />
					Reach students directly.
				</h2>
				<div className='space-y-4 mb-10'>
					{[
						{ icon: 'home', label: 'Lodge, food, service & more' },
						{
							icon: 'shield',
							label: 'Verified agent badge builds trust',
						},
						{ icon: 'bell', label: 'Instant reservation requests' },
					].map(({ icon, label }) => (
						<div key={label} className='flex items-center gap-3'>
							<div className='w-9 h-9 rounded-[10px] bg-white/15 flex items-center justify-center flex-shrink-0'>
								<Icon name={icon} size={18} color='#fff' />
							</div>
							<span className='text-white/90 font-semibold text-[15px]'>
								{label}
							</span>
						</div>
					))}
				</div>
				<div className='border-t border-white/20 pt-5'>
					<p className='text-white/70 text-sm font-semibold'>
						2,400+ verified agents near campus
					</p>
				</div>
			</div>
		</div>
	);
}

export default function Onboarding() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [registerUser, { isSuccess, isError, isLoading, error }] =
		useRegisterMutation();
	const {
		setAgentType,
		passwordValidation,
		formValidation,
		loginValidation,
		deleteListing,
		flash,
		toast,
	} = useApp();
	const [step, setStep] = useState(0);
	const [agent, setAgent] = useState(null);
	const [formData, setFormData] = useState({
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
	});
	const [confirmPassword, setConfirmPassword] = useState('');
	const [type, setType] = useState(true);
	const [type2, setType2] = useState(true);
	const [doc, setDoc] = useState(null);
	const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });
	const [dataValid, isDataValid] = useState(false);

	const detailsValid =
		formData.address &&
		formData.companyName &&
		formData.firstName &&
		formData.lastName &&
		formData.username &&
		formData.password &&
		formData.phone &&
		formData.email &&
		confirmPassword;
	const canNext =
		step === 0 ? !!formData.category : step === 1 ? detailsValid : true;
	const total = 3;

	const hasUppercase = (str) => /[A-Z]/.test(str);
	const validateForm = (e) => {
		e.preventDefault();
		const passwordValidType = hasUppercase(formData.password);
		const passwordValidLength = formData.password.length >= 8;
		const confirmPasswordValid = confirmPassword === formData.password;
		if (!detailsValid) {
			formValidation();
		} else if (!passwordValidLength) {
			passwordValidation('length');
		} else if (!passwordValidType) {
			passwordValidation('type');
		} else if (!confirmPasswordValid) {
			passwordValidation('mismatch');
		} else {
			next(e);
		}
	};
	const handleComplete = async (e) => {
		e.preventDefault();
		try {
			const res = await registerUser(formData).unwrap();
			flash('Successfully created account!');
			dispatch(setCredientials({ ...res }));
			navigate('/dashboard');
		} catch (err) {
			loginValidation(
				(await error?.data?.message) || (await error.message),
			);

			console.log(err);
		}
	};

	const next = (e) => {
		e.preventDefault();
		step < total - 1
			? setStep(step + 1)
			: step === 1
				? validateForm(e)
				: handleComplete(e);
	};
	const back = (e) => {
		e.preventDefault();
		setStep(Math.max(0, step - 1));
	};

	const inputCls =
		'w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 transition-all duration-500 focus:border-primary placeholder:text-faint';

	const TypeStep = (
		<div className='animate-fadeUp' key='type'>
			<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2'>
				Step 1 · Account type
			</div>
			<h2 className='m-0 mb-1 text-[22px] font-extrabold text-ink tracking-[-0.02em]'>
				What do you offer?
			</h2>
			<p className='text-muted text-sm mb-5'>
				Pick the type that fits you best. You can list more later.
			</p>
			<div className='flex items-center justify-between gap-3'>
				{AGENT_TYPES.map((t) => (
					<AgentTypeCard
						key={t.id}
						t={t}
						selected={formData.category === t.id}
						onClick={() =>
							setFormData({ ...formData, category: t.id })
						}
					/>
				))}
			</div>
		</div>
	);

	const DetailsStep = (
		<div className='animate-fadeUp' key='details'>
			<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2'>
				Step 2 · Your details
			</div>
			{/* <h2 className='m-0 mb-5 text-[22px] font-extrabold text-ink tracking-[-0.02em]'>
				Tell us about you
			</h2> */}
			<div className='w-full flex items-center justify-between flex-wrap gap-[1%]'>
				<Field label='First name' className={`w-[49%]`}>
					<input
						className={inputCls}
						placeholder='e.g. Adaeze'
						value={formData.firstName}
						onChange={set('firstName')}
					/>
				</Field>
				<Field label='last name' className={`w-[49%]`}>
					<input
						className={inputCls}
						placeholder='e.g. Okafor'
						value={formData.lastName}
						onChange={set('lastName')}
					/>
				</Field>
				<Field label='username' className={`w-[49%]`}>
					<input
						className={inputCls}
						// placeholder='e.g. Okafor'
						value={formData.username}
						onChange={set('username')}
					/>
				</Field>
				<Field
					className={`w-[49%]`}
					label={
						agent === 'landlord'
							? 'agency / Company name'
							: 'Business / Company name'
					}
				>
					<input
						className={inputCls}
						placeholder='e.g. Sunrise'
						value={formData.companyName}
						onChange={set('companyName')}
					/>
				</Field>
				<Field label='Email' className={`w-full`}>
					<input
						className={inputCls}
						type='email'
						placeholder='you@email.com'
						value={formData.email}
						onChange={set('email')}
					/>
				</Field>
				<Field label='Phone' className={`w-[49%]`}>
					<input
						className={inputCls}
						type='tel'
						placeholder='+234 ...'
						value={formData.phone}
						onChange={set('phone')}
					/>
				</Field>
				<Field label='Whatsapp' opt className={`w-[49%]`}>
					<input
						className={inputCls}
						type='tel'
						placeholder='+234 ...'
						value={formData.whatsapp}
						onChange={set('whatsapp')}
					/>
				</Field>
				<Field label='Area near campus' className={`w-full`}>
					<div className='relative '>
						<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted'>
							<Icon name='pin' size={17} />
						</span>
						<input
							className={`${inputCls} pl-[38px]`}
							placeholder='e.g. Westgate, Tanke'
							value={formData.address}
							onChange={set('address')}
						/>
					</div>
				</Field>
				<Field label='Password' className={`w-[49%] `}>
					<div
						className={`w-full text-[15px] pr-2 text-ink bg-white border-[1.5px] border-line rounded-md2 overflow-hidden transition-all duration-500 focus-within::border-primary placeholder:text-faint flex items-center gap-1`}
					>
						<input
							className={`w-full  px-3.5 py-3`}
							type={type ? 'password' : 'text'}
							value={formData.password}
							onChange={set('password')}
						/>
						<div
							onClick={() => setType(!type)}
							className='hover:text-gray-500 cursor-pointer transition duration-500'
						>
							{type ? <Eye /> : <EyeOff />}
						</div>
					</div>
				</Field>
				<Field label='confirm Password' className={`w-[49%] `}>
					<div
						className={`w-full text-[15px] pr-2 text-ink bg-white border-[1.5px] border-line rounded-md2 overflow-hidden transition-all duration-500 focus-within::border-primary placeholder:text-faint flex items-center gap-1`}
					>
						<input
							className={`w-full  px-3.5 py-3`}
							type={type2 ? 'password' : 'text'}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<div
							onClick={() => setType2(!type2)}
							className='hover:text-gray-500 cursor-pointer transition duration-500'
						>
							{type2 ? <Eye /> : <EyeOff />}
						</div>
					</div>
				</Field>
			</div>
		</div>
	);

	const VerifyStep = (
		<div className='animate-fadeUp' key='verify'>
			<div className='text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2'>
				Step 3 · Verification
			</div>
			<h2 className='m-0 mb-1 text-[22px] font-extrabold text-ink tracking-[-0.02em]'>
				Get verified
			</h2>
			<p className='text-muted text-sm mb-[18px]'>
				We confirm every agent so students can trust your listings.
			</p>
			<UploadDoc file={doc} onUpload={setDoc} />
			<div className='flex gap-2.5 items-start mt-[18px] p-3.5 bg-primary-tint rounded-md2'>
				<Icon name='shield' size={20} color='#0d7a72' />
				<p className='text-[12.5px] text-muted leading-relaxed m-0'>
					Your document is private and only used for verification.
					Approval usually takes under 24 hours.
				</p>
			</div>
		</div>
	);

	return (
		<div className='min-h-screen bg-bg flex'>
			<DesktopBrandPanel />
			<form action='' className='w-3/5 h-full flex flex-col'>
				<div className='flex-1 flex flex-col overflow-hidden'>
					{/* Progress header */}
					<header className='flex-none py-4 px-5 bg-white'>
						<div className='flex items-center justify-between gap-3 mb-3'>
							<div className=''>
								<div className='flex items-center gap-2'>
									{step > 0 ? (
										<button
											className='flex items-center justify-center w-[38px] h-[38px] rounded-[11px] border border-line bg-white cursor-pointer'
											onClick={back}
											aria-label='Back'
										>
											<Icon
												name='chevronLeft'
												size={20}
											/>
										</button>
									) : (
										<BrandMark size={38} />
									)}
									<span className='font-extrabold text-[18px] tracking-[-0.02em] text-ink'>
										Camproxi
									</span>
								</div>

								<p className='text-center capitalize text-sm text-muted mt-3 font-semibold'>
									Already have an account?
									<button
										onClick={() => navigate('/signin')}
										className='text-primary capitalize font-extrabold cursor-pointer bg-none border-none p-0'
									>
										sign in
									</button>
								</p>
							</div>
							<span className='ml-auto text-[13px] font-bold text-faint'>
								{step + 1} / {total}
							</span>
						</div>
						<div className='flex sm:flex-col sm:gap-1.5'>
							{Array.from({ length: total }).map((_, i) => (
								<div
									key={i}
									className='flex-1 h-[5px] rounded-full transition-colors duration-200'
									style={{
										background:
											i <= step ? '#0d7a72' : '#e7edec',
									}}
								/>
							))}
						</div>
					</header>

					<div className='flex-1 overflow-y-auto'>
						<div className='p-6 pb-5'>
							{step === 0 && TypeStep}
							{step === 1 && DetailsStep}
							{step === 2 && VerifyStep}
						</div>
					</div>

					<div className='flex-none mt-auto px-5 py-3.5 bg-white border-t border-line'>
						<button
							className='w-full flex items-center justify-center gap-2 px-5 py-4 bg-primary text-white font-bold text-base rounded-md2 disabled:opacity-45 cursor-pointer hover:bg-primary-600 transition-colors'
							style={{
								boxShadow: '0 3px 10px rgba(13,122,114,0.28)',
							}}
							disabled={!canNext}
							onClick={(e) => {
								step === 1
									? validateForm(e)
									: step !== 1
										? next(e)
										: e.preventDefault();
							}}
						>
							{step < total - 1
								? 'Continue'
								: doc
									? 'Submit & finish'
									: 'Skip & finish'}
							<Icon name='arrowRight' size={18} color='#fff' />
						</button>
					</div>
				</div>
				<Toast msg={toast} icon={'x'} danger={true} />
				<Loading show={isLoading} msg={'Creating Account'} />
			</form>
		</div>
	);
}
