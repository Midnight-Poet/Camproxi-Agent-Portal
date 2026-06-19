import '../Loading.css';

export default function Loading({ msg, show }) {
	if (!show) return null;

	return (
		<div
			style={{ zIndex: '99999' }}
			className='fixed bottom-24 md:bottom-6 left-1/2 sm:left-[55%] -translate-x-1/2 z-9999! bg-ink text-white font-bold text-[13.5px] px-[18px] py-3 rounded-[13px] shadow-lg2 flex items-center gap-2.5 whitespace-nowrap'
		>
			{/* Custom Spinner */}
			<div className='loader'></div>
			{msg || 'Loading...'}
		</div>
	);
}
