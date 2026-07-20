import Icon from '../Icon';

export default function PhotoGallery({ photos, onAdd, onRemove }) {
	return (
		<div className='grid grid-cols-3 gap-2.5'>
			<label
				className='aspect-square cursor-pointer rounded-md flex flex-col items-center justify-center gap-1.5 text-primary-700 hover:bg-primary/5 transition'
				style={{
					border: '1.5px dashed rgba(13,122,114,0.38)',
					background: '#f3f9f8',
				}}
			>
				<Icon name='camera' size={24} color='#084f49' />
				<span className='text-[11.5px] font-bold'>Add photo</span>
				<input
					type='file'
					accept='image/*'
					onChange={onAdd}
					className='hidden'
					multiple={false}
				/>
			</label>
			{photos.map((photo, i) => (
				<div key={i} className='relative aspect-square group'>
					<img
						src={photo.url || photo}
						alt={`photo-${i}`}
						className='w-full h-full object-cover rounded-md'
					/>
					{i === 0 && (
						<span className='absolute bottom-1.5 left-1.5 bg-primary text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-[6px] tracking-[0.03em]'>
							COVER
						</span>
					)}
					<button
						type='button'
						onClick={() => onRemove(i)}
						aria-label='Remove'
						className='absolute top-1 right-1 w-[22px] h-[22px] rounded-full border-none bg-ink/70 text-white cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition'
					>
						<Icon name='x' size={13} color='#fff' stroke={2.4} />
					</button>
				</div>
			))}
		</div>
	);
}
