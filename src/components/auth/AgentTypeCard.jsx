import Icon from '../Icon';

export default function AgentTypeCard({ t, selected, onClick }) {
	return (
		<div
			onClick={onClick}
			className={`relative flex flex-col items-center gap-3.5 w-full text-left p-5 rounded-card cursor-pointer mb-3 border-[1.5px] transition-all duration-150 ${
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
				className={`w-[22px] absolute top-2 right-2 h-[22px] rounded-full flex-shrink-0 flex items-center justify-center ${
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
