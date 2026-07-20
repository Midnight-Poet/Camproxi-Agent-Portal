export default function Spark({ data, color }) {
	const max = Math.max(...data);
	return (
		<div className='flex items-end gap-0.5 h-[22px]' style={{ color }}>
			{data.map((d, i) => (
				<i
					key={i}
					className='flex-1 rounded-sm opacity-90 block'
					style={{
						height: Math.max(12, (d / max) * 100) + '%',
						background: 'currentColor',
					}}
				/>
			))}
		</div>
	);
}
