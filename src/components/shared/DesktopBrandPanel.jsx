import BrandMark from './BrandMark';
import Icon from '../Icon';

export default function DesktopBrandPanel() {
	return (
		<div className='hidden md:flex flex-col justify-between w-2/5 flex-shrink-0 p-12 bg-primary'>
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
