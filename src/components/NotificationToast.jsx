import { useEffect } from 'react';
import Icon from './Icon';

export default function NotificationToast({ toast, onClose }) {
	useEffect(() => {
		if (toast) {
			const timer = setTimeout(() => {
				onClose();
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [toast, onClose]);

	if (!toast) return null;

	return (
		<div className="fixed top-6 left-[5%] right-[5%] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[9999] pointer-events-none flex justify-center">
			<div className="pointer-events-auto bg-white/95 backdrop-blur-xl border-[1.5px] border-white shadow-lg2 rounded-[20px] p-4 flex items-start gap-3.5 w-full sm:w-[400px] animate-pop">
				<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-50 to-primary/20 flex items-center justify-center flex-shrink-0 text-primary border border-primary/20 shadow-sm">
					<Icon name={toast.icon || 'bell'} size={18} stroke={2.2} />
				</div>
				<div className="flex-1 pt-0.5">
					<h4 className="text-[14px] font-extrabold text-ink mb-1 tracking-tight">{toast.title}</h4>
					<p className="text-[13px] text-muted leading-snug">{toast.msg}</p>
				</div>
				<button 
					onClick={onClose} 
					className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 text-muted hover:bg-black/10 hover:text-ink transition-colors flex-shrink-0"
				>
					<Icon name="x" size={14} stroke={2.5} />
				</button>
			</div>
		</div>
	);
}
