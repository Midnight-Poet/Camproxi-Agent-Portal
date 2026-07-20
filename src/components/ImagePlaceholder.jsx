import { useState, useEffect } from 'react';

const AUTO_DELAY = 3000;

export default function ImagePlaceholder({
	images = [],
	label,
	style,
	className,
	children,
}) {
	const [current, setCurrent] = useState(0);
	const [resetKey, setResetKey] = useState(0);
	const isSlider = images.length > 1;

	// Auto-advance; resetKey restarts the timer after manual navigation
	useEffect(() => {
		if (!isSlider) return;
		const id = setInterval(
			() => setCurrent((i) => (i + 1) % images.length),
			AUTO_DELAY,
		);
		return () => clearInterval(id);
	}, [isSlider, images.length, resetKey]);

	const navigate = (dir) => {
		setCurrent((i) => (i + dir + images.length) % images.length);
		setResetKey((k) => k + 1);
	};

	if (images.length === 0) {
		return (
			<div
				className={`relative overflow-hidden flex items-center justify-center text-[#9aa9a5] ${className || ''}`}
				style={{
					background:
						'repeating-linear-gradient(135deg, #eef2f1 0 11px, #e8edec 11px 22px)',
					...style,
				}}
			>
				{children ||
					(label && (
						<span className='text-[10.5px] font-bold tracking-[0.04em] uppercase text-[#9aa9a5] bg-white/70 px-2 py-0.5 rounded-md'>
							{label}
						</span>
					))}
			</div>
		);
	}

	return (
		<div
			className={`relative h-full overflow-hidden ${className || ''}`}
			style={style}
		>
			{/* Sliding track */}
			<div
				className='flex h-full transition-transform duration-500 ease-in-out'
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{images.map((img, i) => {
					const src = typeof img === 'string' ? img : img.src;
					const alt =
						typeof img === 'object' && img.alt
							? img.alt
							: `Image ${i + 1}`;
					return (
						<div
							key={i}
							// src={src}
							alt={alt}
							style={{ flex: '0 0 100%', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
							className='w-full h-full'
						/>
					);
				})}
			</div>

			{isSlider && (
				<>
					{/* Arrows — bare chevrons, inconspicuous */}
					<button
						onClick={() => navigate(-1)}
						aria-label='Previous image'
						className='absolute left-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors'
						style={{
							filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
						}}
					>
						<svg
							width='18'
							height='18'
							viewBox='0 0 16 16'
							fill='none'
						>
							<path
								d='M10 12L6 8l4-4'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
					<button
						onClick={() => navigate(1)}
						aria-label='Next image'
						className='absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors'
						style={{
							filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
						}}
					>
						<svg
							width='18'
							height='18'
							viewBox='0 0 16 16'
							fill='none'
						>
							<path
								d='M6 4l4 4-4 4'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>

					{/* Dot indicators */}
					<div className='absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1'>
						{images.map((_, i) => (
							<button
								key={i}
								onClick={() => {
									setCurrent(i);
									setResetKey((k) => k + 1);
								}}
								aria-label={`Go to image ${i + 1}`}
								className={`h-1.5 rounded-full transition-all duration-500 ${
									i === current
										? 'w-4 bg-white'
										: 'w-1.5 bg-white/50 hover:bg-white/75'
								}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
