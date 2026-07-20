import Icon from '../Icon';

export default function SectionLabel({ children, icon }) {
	return (
		<div className='flex items-center gap-2 mt-6 mb-3.5'>
			{icon && <Icon name={icon} size={18} color='#0d7a72' />}
			<h2 className='m-0 text-[15.5px] font-extrabold text-ink tracking-[-0.01em]'>
				{children}
			</h2>
		</div>
	);
}
