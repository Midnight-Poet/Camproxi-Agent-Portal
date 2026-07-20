import Icon from '../Icon';

export default function CardActions({ onEdit, onDelete }) {
	return (
		<div className='flex gap-2'>
			<button
				className='flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[13.5px] font-bold text-camtext bg-white border border-line rounded-sm2 cursor-pointer hover:bg-bg transition-colors'
				onClick={onEdit}
			>
				<Icon name='edit' size={16} /> Edit
			</button>
			<button
				className='flex items-center justify-center w-10 text-danger bg-white border border-line rounded-sm2 cursor-pointer hover:bg-danger-bg transition-colors'
				onClick={onDelete}
				aria-label='Delete'
			>
				<Icon name='trash' size={17} color='#d2453d' />
			</button>
		</div>
	);
}
