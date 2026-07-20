import Icon from './Icon';

export default function Toast({ msg, icon, danger }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-24 md:bottom-6 left-[35%] sm:left-1/2 sm:-translate-x-1/2 z-[9999] pointer-events-none flex justify-center">
		<div className={`pointer-events-auto ${danger ? 'bg-red-500/80' :'bg-ink'} text-white font-bold text-[13.5px] px-[18px] py-3 rounded-[13px] shadow-lg2 flex items-center gap-2.5 whitespace-nowrap animate-pop`}>
		  <Icon name={icon ? icon : 'check'} size={17} color="#fff" stroke={2.6} />
		  {msg}
		</div>
    </div>
  );
}
