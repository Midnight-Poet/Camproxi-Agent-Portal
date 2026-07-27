import Icon from '../Icon';

export default function QuickAction({ icon, label, sub, onClick, primary }) {
	return (
		<button
			onClick={onClick}
			className={`flex-1 cursor-pointer w-full text-left rounded-[20px] p-4 flex flex-col gap-3 transition-all duration-300 group overflow-hidden relative ${
				primary
					? 'bg-gradient-to-br from-primary to-primary-600 border-transparent text-white hover:shadow-glow hover:-translate-y-1'
					: 'bg-surface border-line text-ink shadow-sm2 hover:shadow-md hover:bg-bg hover:-translate-y-1'
			} border`}
		>
			<div
				className={`flex items-center justify-center self-center rounded-[11px] relative z-10 w-[42px] h-[42px] ${
					primary ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700 group-hover:bg-primary-100 transition-colors'
				}`}
			>
				<Icon
					name={icon}
					size={20}
					stroke={2}
					color='currentColor'
				/>
			</div>
			<div className='relative z-10 mt-1 text-center'>
				<div
					className={`font-extrabold text-[14.5px] ${primary ? 'text-white' : 'text-ink'}`}
				>
					{label}
				</div>
				<div
					className={`text-[12px] font-bold mt-0.5 ${
						primary ? 'text-white/80' : 'text-muted group-hover:text-camtext transition-colors'
					}`}
				>
					{sub}
				</div>
			</div>
		</button>
	);
}
