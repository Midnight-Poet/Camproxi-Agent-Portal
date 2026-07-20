import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useLoginMutation } from '../../redux/api/agentApiSlice';
import { useDispatch } from 'react-redux';
import { setCredientials } from '../../redux/feautures/auth/authSlice';
import { useApp } from '../../context/AppContext';
import Toast from '../../components/Toast';
import Loading from '../../components/Loading';
import BrandMark from '../../components/shared/BrandMark';
import DesktopBrandPanel from '../../components/shared/DesktopBrandPanel';

import GoogleGlyph from '../../components/auth/GoogleGlyph';
import Divider from '../../components/auth/Divider';


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
			loginValidation(await err?.data?.message || await err.message)
			console.log(await err)
		}
	};

	return (
		<div className='min-h-screen bg-bg flex relative overflow-hidden'>
			{/* Desktop brand panel */}
			<DesktopBrandPanel />

			{/* Sign in form */}
			<div className='flex-1 flex items-center justify-center p-6 relative z-10'>
				{/* Decorative ambient glow */}
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none' />
				
				<div className='w-full max-w-[500px] glass-heavy p-6 md:p-8 rounded-[32px] animate-fadeUp relative'>
					{/* Mobile wordmark */}
					<div className='flex items-center gap-2.5 mb-8 md:hidden'>
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-sm">
							<BrandMark size={24} color="#fff" />
						</div>
						<span className='text-[24px] font-black text-ink tracking-tight'>
							Camproxi
						</span>
					</div>

					<h2 className='text-[32px] font-black text-ink tracking-tight mb-2'>
						Welcome back
					</h2>
					<p className='text-muted text-[15px] mb-10 leading-relaxed font-medium'>
						Sign in to manage your listings and student requests.
					</p>

					<form className='space-y-4'>
						<div>
							<label className='block text-[13px] font-black text-camtext mb-2 uppercase tracking-[0.05em]'>
								Email
							</label>
							<input
								type='email'
								placeholder='you@email.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete='username'
								className='w-full text-[15px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-xl px-4 py-3 transition-all focus:bg-white focus:border-primary focus:ring-[4px] focus:ring-primary/15 hover:bg-white/80 placeholder:text-faint font-medium'
							/>
						</div>
						<div>
							<label className='block text-[13px] font-black text-camtext mb-2 uppercase tracking-[0.05em]'>
								Password
							</label>
							<div className='relative'>
								<input
									type={showPw ? 'text' : 'password'}
									placeholder='••••••••'
									value={password}
									onChange={(e) => setPw(e.target.value)}
									className='w-full text-[15px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-xl px-4 py-3 pr-12 transition-all focus:bg-white focus:border-primary focus:ring-[4px] focus:ring-primary/15 hover:bg-white/80 placeholder:text-faint font-medium'
								/>
								<button
									type='button'
									onClick={() => setShowPw((s) => !s)}
									aria-label={showPw ? 'Hide' : 'Show'}
									className='absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-faint hover:text-primary transition-colors cursor-pointer bg-transparent border-none rounded-full hover:bg-black/5'
								>
									<Icon
										name={showPw ? 'eyeOff' : 'eye'}
										size={20}
									/>
								</button>
							</div>
						</div>
						<div className='flex justify-end -mt-2'>
							<a
								href='#'
								onClick={(e) => e.preventDefault()}
								className='text-[13px] font-extrabold text-primary no-underline hover:text-primary-700 transition-colors'
							>
								Forgot password?
							</a>
						</div>
						<button
							type='submit'
							onClick={handleSignIn}
							disabled={!valid || isLoading}
							className='w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-[16px] rounded-xl disabled:opacity-50 cursor-pointer hover:shadow-glow transition-all duration-300 mt-2 border-none group'
						>
							Sign in{' '}
							<span className="transform group-hover:translate-x-1 transition-transform">
								<Icon name='arrowRight' size={18} color='#fff' />
							</span>
						</button>
					</form>

					<p className='text-center text-[15px] text-muted mt-6 font-semibold'>
						New to Camproxi?{' '}
						<button
							onClick={() => navigate('/onboarding')}
							className='text-primary font-black cursor-pointer bg-none border-none p-0 hover:text-primary-700 transition-colors'
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
