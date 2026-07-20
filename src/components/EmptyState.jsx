import Icon from './Icon';

export default function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fadeUp">
      <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-primary-50 to-primary/10 flex items-center justify-center mb-5 shadow-sm2 border border-white relative group animate-float">
        <div className="absolute inset-0 rounded-[20px] shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Icon name={icon} size={36} color="#0FA99D" stroke={1.8} />
      </div>
      <div className="text-[18px] font-black text-ink mb-2 tracking-tight">{title}</div>
      <p className="text-[14px] text-faint max-w-[280px] leading-relaxed mb-6 font-medium">{body}</p>
      {action}
    </div>
  );
}
