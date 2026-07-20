import { useSelector } from 'react-redux';
import { useApp } from '../context/AppContext';

export default function Avatar({ name = '', size = 40, color, url }) {
	const initials = name
		.split(' ')
		.map((w) => w[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
	const colors = [
		'#0d7a72',
		'#4f46e5',
		'#c8821a',
		'#1f9d6b',
		'#d2453d',
		'#7a5ae0',
	];
	const bg = color || colors[name.charCodeAt(0) % colors.length];
	return (
		<div
			className="shadow-sm border-2 border-black/10 transition-transform duration-300 hover:scale-[1.03]"
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				backgroundImage: url ? `url(${url})` : '',
				backgroundColor: bg,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				color: '#fff',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontWeight: 800,
				fontSize: size * 0.36,
				flexShrink: 0,
				letterSpacing: '-0.02em',
			}}
		>
			{url ? '' : initials}
		</div>
	);
}
