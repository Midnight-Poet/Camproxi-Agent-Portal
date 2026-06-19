import Icon from './Icon';

export default function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-4">
      <div className="w-16 h-16 rounded-card bg-primary-50 flex items-center justify-center mb-4">
        <Icon name={icon} size={32} color="#0d7a72" stroke={1.6} />
      </div>
      <div className="text-base font-extrabold text-ink mb-1.5">{title}</div>
      <p className="text-sm text-muted max-w-[260px] leading-relaxed mb-5">{body}</p>
      {action}
    </div>
  );
}
