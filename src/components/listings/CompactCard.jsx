import Icon from '../Icon';
import StatusBadge from '../StatusBadge';
import ImagePlaceholder from '../ImagePlaceholder';
import { priceLine } from '../../data';

export default function CompactCard({ l, onEdit, onDelete }) {
	const iconMap = {
		lodge: 'home',
		food: 'fork',
		groceries: 'bag',
		service: 'wrench',
	};
	return (
		<div className='bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-3 p-3 flex gap-3.5 animate-fadeUp'>
			<ImagePlaceholder
				style={{
					width: 84,
					height: 84,
					borderRadius: 14,
					flexShrink: 0,
				}}
			>
				<Icon name={iconMap[l.type]} size={26} color='#aab8b4' />
			</ImagePlaceholder>
			<div className='flex-1 min-w-0 flex flex-col'>
				<div className='flex justify-between gap-2 items-start'>
					<div className='font-extrabold text-[15px] text-ink min-w-0 truncate'>
						{l.title}
					</div>
				</div>
				<div className='text-muted text-[12.5px] flex items-center gap-1 mt-0.5'>
					<Icon name='pin' size={13} />{' '}
					<span className='truncate'>{l.area}</span>
				</div>
				<div className='flex items-center gap-2 mt-1.5'>
					<StatusBadge status={l.status} />
					<span className='font-extrabold text-[13.5px] text-primary-700 ml-auto'>
						{priceLine(l)}
					</span>
				</div>
				<div className='flex gap-2 mt-2.5'>
					<button
						className='flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] font-bold text-primary-700 bg-primary-50 rounded-sm2 cursor-pointer hover:bg-primary-100 transition-colors'
						onClick={onEdit}
					>
						<Icon name='edit' size={15} /> Edit
					</button>
					<button
						className='flex items-center justify-center w-9 text-danger bg-white border border-line rounded-sm2 cursor-pointer'
						onClick={onDelete}
					>
						<Icon name='trash' size={16} color='#d2453d' />
					</button>
				</div>
			</div>
		</div>
	);
}
