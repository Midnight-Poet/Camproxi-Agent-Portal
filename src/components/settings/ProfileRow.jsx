import Icon from '../Icon';

export default function ProfileRow({ icon, label, value, danger, onClick, last }) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-3.5 px-[15px] py-4 w-full text-left border-none bg-transparent cursor-pointer hover:bg-black/5 transition-colors ${last ? '' : 'border-b border-line2'}`}
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
