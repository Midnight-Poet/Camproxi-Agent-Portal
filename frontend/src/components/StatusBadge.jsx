const STATUS_MAP = {
  active:  { label: 'Active',           cls: 'bg-ok-bg text-ok' },
  pending: { label: 'Pending Approval', cls: 'bg-warn-bg text-warn' },
  taken:   { label: 'Taken',            cls: 'bg-gone-bg text-gone' },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.active;
  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-bold tracking-[0.01em] px-2 py-1 rounded-full ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
