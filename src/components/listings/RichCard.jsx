import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import StatusBadge from '../StatusBadge';
import ImagePlaceholder from '../ImagePlaceholder';
import { priceLine } from '../../data';
import CardActions from './CardActions';

export default function RichCard({ l, onEdit, onDelete }) {
	const navigate = useNavigate();
	let images = [];
	if (Array.isArray(l.images)) {
		l.images.forEach((item) => {
			if (item) images.push(item.url || item);
		});
	} else if (l.images?.url) {
		images.push(l.images.url);
	} else if (typeof l.images === 'string') {
		images.push(l.images);
	}
	return (
		<div className='glass-heavy rounded-[24px] border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden mb-3.5 animate-fadeUp flex flex-col'>
			<div className='relative h-60 cursor-pointer' onClick={() => navigate(`/listings/${l.id || l._id}`)}>
				<ImagePlaceholder images={images} label={l.i} />
				<div className='absolute top-3 left-3'>
					<StatusBadge status={l.status} />
				</div>
			</div>
			<div className='p-[15px]'>
				<div className='flex justify-between items-start gap-2.5 cursor-pointer' onClick={() => navigate(`/listings/${l.id || l._id}`)}>
					<div className='min-w-0'>
						<div className='font-extrabold text-base text-ink tracking-[-0.01em] hover:text-primary transition-colors'>
							{l.name}
						</div>
						{/* <div className='font-medium capitalize text-base text-ink tracking-[-0.01em]'>
							{l.description}
						</div> */}
						{l.address && (
							<div className='text-muted text-[13px] flex items-center gap-1 mt-1'>
								<Icon name='pin' size={14} /> {l.address}
							</div>
						)}
						{l.businessCategory && (
							<div className='text-muted text-[13px] flex items-center gap-1 mt-0.5'>
								<Icon name='tag' size={14} /> {l.businessCategory}
							</div>
						)}
					</div>
				</div>
				<div className='flex items-center gap-3.5 my-3'>
					<div className='font-extrabold text-[15px] text-primary-700'>
						{priceLine(l)}
					</div>
					<div className='ml-auto flex gap-3.5'>
						<span className='text-muted text-[12.5px] font-semibold flex items-center gap-1'>
							<Icon name='eye' size={15} /> {l.views || 0}
						</span>
						<span className='text-muted text-[12.5px] font-semibold flex items-center gap-1'>
							<Icon name='requests' size={15} /> {l.reqs || 0}
						</span>
					</div>
				</div>
				<CardActions onEdit={onEdit} onDelete={onDelete} />
			</div>
		</div>
	);
}
