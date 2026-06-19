import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useLoginMutation } from '../../redux/api/agentApiSlice';
import { useDispatch } from 'react-redux';
import { setCredientials } from '../../redux/feautures/auth/authSlice';
import { useApp } from '../../context/AppContext';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';

function GoogleGlyph({ size = 19 }) {
	return (
		<svg width={size} height={size} viewBox='0 0 48 48' aria-hidden='true'>
			<path
				fill='#FFC107'
				d='M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 0 1 0-24c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z'
			/>
			<path
				fill='#FF3D00'
				d='M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z'
			/>
			<path
				fill='#4CAF50'
				d='M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5A20 20 0 0 0 24 44z'
			/>
			<path
				fill='#1976D2'
				d='M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C39.9 35.4 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z'
			/>
		</svg>
	);
}

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

export default function SignIn() {
	const [userLogin, { isSuccess, isError, isLoading, error }] =
		useLoginMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch()
	const {flash, loginValidation, toast} = useApp()

	const [email, setEmail] = useState('');
	const [password, setPw] = useState('');
	const [showPw, setShowPw] = useState(false);
	const valid = email.includes('@') && password.length >= 4;

	const handleSignIn = async (e) => {
		e.preventDefault()
		try {
			const res = await userLogin({email, password}).unwrap()
			flash('Successfully Logged in!')
			dispatch(setCredientials({...res}))
			navigate('/dashboard');
		} catch (err) {
			loginValidation(error?.data?.message || error.message)
			console.log(err)
		}
	};

	return (
		<div className='min-h-screen bg-bg flex'>
			{/* Desktop brand panel */}
			<div
				className='hidden md:flex flex-col justify-between w-2/5 flex-shrink-0 p-12'
				style={{
					background:
						'linear-gradient(160deg, #0d7a72 0%, #084f49 100%)',
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
							{
								icon: 'home',
								label: 'Lodge, food, service & more',
							},
							{
								icon: 'shield',
								label: 'Verified agent badge builds trust',
							},
							{
								icon: 'bell',
								label: 'Instant reservation requests',
							},
						].map(({ icon, label }) => (
							<div
								key={label}
								className='flex items-center gap-3'
							>
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

			{/* Sign in form */}
			<div className='flex-1 flex items-center justify-center p-6'>
				<div className='w-full max-w-[420px]'>
					{/* Mobile wordmark */}
					<div className='flex items-center gap-2.5 mb-8 md:hidden'>
						<BrandMark size={38} />
						<span className='text-[22px] font-extrabold text-ink tracking-[-0.03em]'>
							Camproxi
						</span>
					</div>

					<h2 className='text-[28px] font-extrabold text-ink tracking-[-0.03em] mb-1'>
						Welcome back
					</h2>
					<p className='text-muted text-[14.5px] mb-8'>
						Sign in to manage your listings and student requests.
					</p>

					<form
						className='space-y-4'
					>
						<div>
							<label className='block text-[13px] font-bold text-camtext mb-1.5'>
								Email
							</label>
							<input
								type='email'
								placeholder='you@email.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete='username'
								className='w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/14 placeholder:text-faint'
							/>
						</div>
						<div>
							<label className='block text-[13px] font-bold text-camtext mb-1.5'>
								Password
							</label>
							<div className='relative'>
								<input
									type={showPw ? 'text' : 'password'}
									placeholder='••••••••'
									value={password}
									onChange={(e) => setPw(e.target.value)}
									// autoComplete='current-password'
									className='w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 pr-12 transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/14 placeholder:text-faint'
								/>
								<button
									type='button'
									onClick={() => setShowPw((s) => !s)}
									aria-label={showPw ? 'Hide' : 'Show'}
									className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-faint flex'
								>
									<Icon
										name={showPw ? 'eyeOff' : 'eye'}
										size={19}
									/>
								</button>
							</div>
						</div>
						<div className='flex justify-end -mt-1'>
							<a
								href='#'
								onClick={(e) => e.preventDefault()}
								className='text-[13.5px] font-bold text-primary no-underline'
							>
								Forgot password?
							</a>
						</div>
						<button
							type='submit'
							onClick={handleSignIn}
							disabled={!valid || isLoading}
							className='w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white font-bold text-base rounded-md2 disabled:opacity-45 cursor-pointer hover:bg-primary-600 transition-colors mt-2'
							style={{
								boxShadow: '0 3px 10px rgba(13,122,114,0.28)',
							}}
						>
							Sign in{' '}
							<Icon name='arrowRight' size={18} color='#fff' />
						</button>
					</form>

					{/* <div className='flex items-center gap-3 my-6'>
						<div className='flex-1 h-px bg-line' />
						<span className='text-xs font-bold text-faint tracking-[0.04em]'>
							OR
						</span>
						<div className='flex-1 h-px bg-line' />
					</div> */}

					{/* <button
						type='button'
						onClick={handleSignIn}
						className='w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white border border-line rounded-md2 font-bold text-base text-camtext hover:bg-bg transition-colors cursor-pointer'
					>
						<GoogleGlyph /> Continue with Google
					</button> */}

					<p className='text-center text-sm text-muted mt-8 font-semibold'>
						New to Camproxi?{' '}
						<button
							onClick={() => navigate('/onboarding')}
							className='text-primary font-extrabold cursor-pointer bg-none border-none p-0'
						>
							Create an account
						</button>
					</p>
				</div>
			</div>
			<Toast msg={toast} icon={'x'} danger={true} />
			<Loading show={isLoading} msg={'Logging in...'} />
		</div>
	);
}
