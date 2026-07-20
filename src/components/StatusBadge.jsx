const STATUS_MAP = {
  active:  { label: 'Active',           cls: 'bg-ok-bg text-ok' },
  pending: { label: 'Pending Approval', cls: 'bg-warn-bg text-warn' },
  taken:   { label: 'Taken',            cls: 'bg-gone-bg text-gone' },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.active;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-full border border-white/40 shadow-sm backdrop-blur-sm ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_4px_currentColor]" />
      <span className="uppercase tracking-wider">{s.label}</span>
    </span>
  );
}
