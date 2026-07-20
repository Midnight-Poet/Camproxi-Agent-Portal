import Icon from '../Icon';

export default function BrandMark({ size = 38 }) {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.3,
				background: '#0d7a72',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 2px 6px rgba(13,122,114,0.15)',
			}}
		>
			<Icon name='pin' size={size * 0.56} color='#fff' stroke={2.1} />
		</div>
	);
}
