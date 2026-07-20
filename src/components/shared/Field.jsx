export const inputCls =
	'w-full text-[15px] text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-[4px] focus:ring-primary/15 hover:bg-white/80 placeholder:text-faint font-medium';

export default function Field({ label, opt, children, className }) {
	return (
		<div className={`mb-5 ${className}`}>
			<label className='block uppercase text-[12.5px] font-black tracking-[0.05em] text-camtext mb-2'>
				{label}
				{opt && (
					<span className='text-faint font-semibold normal-case tracking-normal ml-1'>
						(Optional)
					</span>
				)}
			</label>
			{children}
		</div>
	);
}
