import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import Icon from './Icon';

export default function AppBar({ title, sub, action, onBack, flush }) {
  const {agentName, profileImg} = useApp()
	return (
		<header
			className={`flex justify-between items-center pt-4 pb-3.5 px-[18px] ${flush ? 'bg-bg border-none' : 'bg-white border-b border-line'}`}
		>
			<div className='flex items-center gap-3'>
				{onBack && (
					<button
						onClick={onBack}
						className='flex items-center justify-center w-9 h-9 rounded-[11px] border border-line bg-white cursor-pointer flex-shrink-0'
						aria-label='Back'
					>
						<Icon name='chevronLeft' size={20} color='#2b3a37' />
					</button>
				)}
				<div className='flex-1 min-w-0'>
					<h1 className='m-0 text-[23px] font-extrabold tracking-[-0.02em] text-ink leading-tight'>
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
