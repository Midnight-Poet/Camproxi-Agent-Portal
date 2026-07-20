export default function Divider() {
	return (
		<div className='flex items-center gap-3 my-6'>
			<div className='flex-1 h-px bg-line' />
			<span className='text-xs font-bold text-faint tracking-[0.04em]'>
				OR
			</span>
			<div className='flex-1 h-px bg-line' />
		</div>
	);
}
