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

import RequestCard from '../../components/requests/RequestCard';

export default function Requests() {
  const { requests, actRequest, pendingCount } = useApp();
  const [tab, setTab] = useState('pending');
  const counts = requests.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
  const shown = requests.filter(r => r.status === tab);

  return (
    <Layout>
      <div className="flex flex-col h-full bg-transparent">
        <AppBar title="Requests" sub={`${pendingCount} awaiting your response`} flush />

        {/* Tab bar */}
        <div className="flex-none px-4 sm:px-6 pb-4">
          <div className="flex gap-1 bg-white/40 backdrop-blur-md p-1.5 rounded-[16px] shadow-inner">
            {REQ_TABS.map(t => {
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 flex justify-center items-center py-2.5 cursor-pointer border-[1.5px] rounded-[12px] font-bold text-[13.5px] transition-all duration-300 ${
                    on ? 'bg-primary/10 text-primary-700 shadow-sm border-primary/15 scale-[1.02]' : 'bg-transparent border-transparent text-muted hover:bg-black/[0.04]'
                  }`}>
                  {t.label}{counts[t.id] ? ' · ' + counts[t.id] : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 pb-7">
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
