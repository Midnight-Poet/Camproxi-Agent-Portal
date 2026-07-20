import Icon from '../Icon';
import Avatar from '../Avatar';

const TYPE_ICON = { lodge: 'home', food: 'fork', groceries: 'bag', service: 'wrench' };

export default function RequestCard({ r, onAct }) {
  const isPending = r.status === 'pending';
  return (
    <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm p-4 sm:p-5 mb-4 animate-fadeUp hover:shadow-md transition-shadow">
      <div className="flex gap-3 sm:gap-4">
        <Avatar name={r.name} url={r.avatarUrl} size={46} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2.5 items-baseline">
            <div className="font-extrabold text-[15.5px] text-ink flex-1 min-w-0 truncate">{r.name}</div>
            <span className="text-faint text-[12px] font-semibold whitespace-nowrap flex-shrink-0">{r.when}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Icon name={TYPE_ICON[r.type]} size={14} color="#0d7a72" className="flex-shrink-0" />
            <span className="text-muted text-[13px] font-semibold truncate">
              Interested in <strong className="text-camtext">{r.listing}</strong>
            </span>
          </div>
        </div>
      </div>

      {r.note && (
        <div className="bg-white/40 backdrop-blur-sm rounded-[16px] px-4 py-3 mt-4 text-[13.5px] text-camtext leading-relaxed border border-white/50">
          <span className="text-ink font-medium">"{r.note}"</span>
        </div>
      )}

      {isPending ? (
        <div className="flex gap-3 mt-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-3.5 font-bold text-danger bg-white/60 backdrop-blur-sm border-[1.5px] border-danger/20 rounded-[16px] cursor-pointer hover:bg-danger-bg transition-colors" onClick={() => onAct(r.id, 'declined')}>
            <Icon name="x" size={17} stroke={2.2} color="#d2453d" /> Decline
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-3.5 font-bold text-white bg-gradient-to-r from-primary to-primary-600 rounded-[16px] border-none cursor-pointer hover:shadow-glow transition-all"
            onClick={() => onAct(r.id, 'accepted')}>
            <Icon name="check" size={17} color="#fff" stroke={2.4} /> Accept
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/40">
          {r.status === 'accepted'
            ? <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-ok-bg text-ok">
                <Icon name="check" size={13} stroke={3} color="#1f9d6b" /> Accepted
              </span>
            : <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-gone-bg text-gone">
                <Icon name="x" size={13} stroke={2.4} color="#7d8d89" /> Declined
              </span>
          }
          <button className="ml-auto px-4 py-2 text-[13px] font-bold text-primary-700 bg-primary/10 border-none rounded-full cursor-pointer hover:bg-primary/20 transition-colors">
            Message student
          </button>
        </div>
      )}
    </div>
  );
}
