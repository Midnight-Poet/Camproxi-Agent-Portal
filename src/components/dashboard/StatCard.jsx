import Icon from '../Icon';
import Spark from './Spark';

export default function StatCard({ stat, big, onClick }) {
	const solid = stat.solid;
	return (
		<button
			onClick={onClick}
			className={`text-left cursor-pointer flex flex-col w-full rounded-[20px] border transition-all duration-300 group overflow-hidden relative ${
				solid
					? 'bg-gradient-to-br from-primary to-primary-600 border-transparent text-white hover:shadow-glow hover:-translate-y-1'
					: 'bg-white/60 backdrop-blur-sm border-black/10 text-ink shadow-sm hover:shadow-md hover:bg-white/80 hover:-translate-y-1'
			} ${big ? 'p-5 gap-3.5' : 'p-4 gap-2'}`}
		>
			
			<div className='flex items-center justify-between relative z-10 w-full'>
				<div
					className={`flex items-center justify-center rounded-md2 ${
						solid ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700 group-hover:bg-primary-100 transition-colors'
					}`}
					style={{
						width: big ? 42 : 36,
						height: big ? 42 : 36,
					}}
				>
					<Icon
						name={stat.icon}
						size={big ? 22 : 19}
						stroke={1.9}
						color='currentColor'
					/>
				</div>
				{stat.spark && (
					<Spark
						data={stat.spark}
						color={solid ? 'rgba(255,255,255,0.6)' : '#0d7a72'}
					/>
				)}
			</div>
			
			<div className='relative z-10 mt-1'>
				<div
					className={`font-extrabold tracking-[-0.03em] leading-none ${solid ? 'text-white' : 'text-ink'}`}
					style={{ fontSize: big ? 36 : 28 }}
				>
					{stat.value}
				</div>
				<div className='flex items-center gap-1.5 mt-1.5'>
					<span
						className={`text-[13px] font-bold ${
							solid ? 'text-white/80' : 'text-muted group-hover:text-camtext transition-colors'
						}`}
					>
						{stat.label}
					</span>
				</div>
			</div>
			
			{stat.trend && (
				<div
					className={`text-[12px] font-bold mt-0.5 ${
						solid ? 'text-white/90' : 'text-ok'
					}`}
				>
					{stat.trend}
				</div>
			)}
		</button>
	);
}
