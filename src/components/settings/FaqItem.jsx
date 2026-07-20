import Icon from '../Icon';

export default function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-line2">
      <button onClick={onToggle} className="flex items-center gap-3 p-[15px] w-full text-left border-none bg-none cursor-pointer hover:bg-bg transition-colors">
        <span className="flex-1 font-bold text-[14.5px] text-ink leading-[1.35]">{q}</span>
        <Icon name="chevronDown" size={18} color="#93a4a0"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      {open && (
        <div className="text-muted text-[13.5px] leading-relaxed px-[15px] pb-4 animate-fadeUp">{a}</div>
      )}
    </div>
  );
}
