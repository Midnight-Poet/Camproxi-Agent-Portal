import Icon from '../../components/Icon';
import AppBar from '../../components/AppBar';
import EmptyState from '../../components/EmptyState';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';

const NOTIF_META = {
  request:  { icon: 'requests', colorCls: 'text-primary-700', bgCls: 'bg-primary-50' },
  approved: { icon: 'check',    colorCls: 'text-ok',          bgCls: 'bg-ok-bg' },
  view:     { icon: 'eye',      colorCls: 'text-primary-700', bgCls: 'bg-primary-50' },
  pending:  { icon: 'clock',    colorCls: 'text-warn',        bgCls: 'bg-warn-bg' },
  system:   { icon: 'info',     colorCls: 'text-muted',       bgCls: 'bg-gone-bg' },
};

export default function Notifications() {
  const { notifs, clearNotifs, unreadCount } = useApp();

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <AppBar
          title="Notifications"
          sub={unreadCount ? `${unreadCount} unread` : 'All caught up'}
          action={
            unreadCount > 0 ? (
              <button onClick={clearNotifs}
                className="px-3 py-2 text-[13px] font-bold text-primary-700 bg-primary-50 rounded-sm2 cursor-pointer hover:bg-primary-100 transition-colors">
                Mark all read
              </button>
            ) : null
          }
        />

        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] py-[18px] pb-7">
            {notifs.length === 0 ? (
              <EmptyState icon="bell" title="No notifications" body="Updates about your listings and requests show up here." />
            ) : (
              <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden">
                {notifs.map((n, i) => {
                  const m = NOTIF_META[n.kind] || NOTIF_META.system;
                  return (
                    <div key={n.id}>
                      {i > 0 && <div className="h-px bg-line" />}
                      <div className={`flex gap-3 p-[15px] relative ${n.unread ? 'bg-primary-tint' : ''}`}>
                        <div className={`w-10 h-10 rounded-[12px] flex-shrink-0 flex items-center justify-center ${m.bgCls} ${m.colorCls}`}>
                          <Icon name={m.icon} size={20} stroke={1.9} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <span className="font-extrabold text-[14px] text-ink">{n.title}</span>
                            <span className="text-faint text-[11.5px] font-semibold whitespace-nowrap">{n.when}</span>
                          </div>
                          <div className="text-muted text-[13px] mt-0.5 leading-relaxed">{n.body}</div>
                        </div>
                        {n.unread && <div className="absolute top-[18px] right-3.5 w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
