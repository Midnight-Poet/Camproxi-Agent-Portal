import { useState } from 'react';
import Icon from '../../components/Icon';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import AppBar from '../../components/AppBar';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';

const REQ_TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
];

const TYPE_ICON = { lodge: 'home', food: 'fork', groceries: 'bag', service: 'wrench' };

function RequestCard({ r, onAct }) {
  const isPending = r.status === 'pending';
  return (
    <div className="bg-white rounded-card border border-line2 shadow-sm2 p-[15px] mb-3 animate-fadeUp">
      <div className="flex gap-3">
        <Avatar name={r.name} color={r.avatar} size={46} />
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
        <div className="bg-bg rounded-md2 px-3.5 py-2.5 mt-3 text-[13.5px] text-camtext leading-relaxed">
          <span className="text-faint italic">"{r.note}"</span>
        </div>
      )}

      {isPending ? (
        <div className="flex gap-2.5 mt-3.5">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-3 font-bold text-danger bg-white border border-line rounded-md2 cursor-pointer hover:bg-danger-bg transition-colors" onClick={() => onAct(r.id, 'declined')}>
            <Icon name="x" size={17} stroke={2.2} color="#d2453d" /> Decline
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-3 font-bold text-white bg-primary rounded-md2 cursor-pointer hover:bg-primary-600 transition-colors"
            style={{ boxShadow: '0 3px 10px rgba(13,122,114,0.28)' }}
            onClick={() => onAct(r.id, 'accepted')}>
            <Icon name="check" size={17} color="#fff" stroke={2.4} /> Accept
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-3">
          {r.status === 'accepted'
            ? <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-full bg-ok-bg text-ok">
                <Icon name="check" size={13} stroke={3} color="#1f9d6b" /> Accepted
              </span>
            : <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2 py-1 rounded-full bg-gone-bg text-gone">
                <Icon name="x" size={13} stroke={2.4} color="#7d8d89" /> Declined
              </span>
          }
          <button className="ml-auto px-3 py-2 text-[13px] font-bold text-primary-700 bg-primary-50 rounded-sm2 cursor-pointer hover:bg-primary-100 transition-colors">
            Message student
          </button>
        </div>
      )}
    </div>
  );
}

export default function Requests() {
  const { requests, actRequest, pendingCount } = useApp();
  const [tab, setTab] = useState('pending');
  const counts = requests.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
  const shown = requests.filter(r => r.status === tab);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <AppBar title="Requests" sub={`${pendingCount} awaiting your response`} flush />

        {/* Tab bar */}
        <div className="flex-none px-[18px] pb-3">
          <div className="flex gap-1 bg-line2 p-1 rounded-[13px]">
            {REQ_TABS.map(t => {
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 cursor-pointer border-none rounded-[10px] font-bold text-[13px] transition-all duration-150 ${
                    on ? 'bg-white text-ink shadow-sm2' : 'bg-transparent text-muted'
                  }`}>
                  {t.label}{counts[t.id] ? ' · ' + counts[t.id] : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7">
            {shown.length === 0 ? (
              <EmptyState icon="requests"
                title={tab === 'pending' ? 'No pending requests' : 'Nothing here'}
                body={tab === 'pending' ? 'New student requests will appear here for you to accept or decline.' : `You have no ${tab} requests yet.`} />
            ) : (
              shown.map(r => <RequestCard key={r.id} r={r} onAct={actRequest} />)
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
