import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import Icon from './Icon';

export default function AppBar({ title, sub, action, onBack, flush }) {
  const {agentName, profileImg} = useApp()
	return (
		<header
			className={`sticky top-0 z-50 flex justify-between items-center pt-5 pb-4 px-5 transition-colors duration-300 ${flush ? 'bg-transparent border-none' : 'glass border-b-0'}`}
		>
			<div className='flex items-center gap-3 w-full pr-4'>
				{onBack && (
					<button
						onClick={onBack}
						className='flex items-center justify-center w-[40px] h-[40px] rounded-full border border-line2 bg-white/80 shadow-sm hover:shadow hover:bg-white cursor-pointer flex-shrink-0 transition-all duration-200'
						aria-label='Back'
					>
						<Icon name='chevronLeft' size={22} color='#14201e' />
					</button>
				)}
				<div className='flex-1 min-w-0'>
					<h1 className='m-0 text-[24px] font-black tracking-tight text-ink leading-tight truncate'>
						{title}
					</h1>
					{sub && (
						<p className='mt-0.5 text-[13px] text-muted font-medium'>
							{sub}
						</p>
					)}
				</div>
				{action && <div className='flex-shrink-0'>{action}</div>}
			</div>
			<Avatar name={agentName} size={45} url={profileImg} />
		</header>
	);
}
