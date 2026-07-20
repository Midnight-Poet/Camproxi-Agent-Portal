import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import AppBar from '../../components/AppBar';
import EmptyState from '../../components/EmptyState';
import Layout from '../../components/Layout';
import { useApp } from '../../context/AppContext';

const NOTIF_META = {
  REQUEST_CREATED: { icon: 'requests', colorCls: 'text-primary-700', bgCls: 'bg-primary-50' },
  REQUEST_UPDATED: { icon: 'check',    colorCls: 'text-ok',          bgCls: 'bg-ok-bg' },
  REVIEW_CREATED:  { icon: 'star',     colorCls: 'text-primary-700', bgCls: 'bg-primary-50' },
  system:          { icon: 'info',     colorCls: 'text-muted',       bgCls: 'bg-gone-bg' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifs, clearNotifs, unreadCount, markNotifRead, isLoadingNotifs } = useApp();

  return (
    <Layout>
      <div className="flex flex-col h-full bg-transparent">
        <AppBar 
          title="Notifications" 
          sub={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          action={notifs.length > 0 ? (
            <button 
              onClick={() => clearNotifs()}
              className="text-[13px] font-bold text-primary bg-primary-tint px-4 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              Mark all as read
            </button>
          ) : null}
        />
        <div className="flex-1 overflow-y-auto mt-4 px-[18px] pb-6">
          <div className="max-w-2xl mx-auto w-full">
            {isLoadingNotifs ? (
              <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-[12px] bg-white/40 flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-white/40 rounded w-1/3" />
                      <div className="h-3 bg-white/40 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifs.length === 0 ? (
              <EmptyState icon="bell" title="No notifications" body="Updates about your listings and requests show up here." />
            ) : (
              <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden">
                {notifs.map((n, i) => {
                  const type = (n.category || '').toUpperCase();
                  const m = NOTIF_META[type] || NOTIF_META.system;
                  const isRead = Boolean(n.isRead || n.read);
                  const notifId = n.id || n._id;
                  
                  return (
                    <div key={notifId}>
                      {i > 0 && <div className="h-px bg-white/40" />}
                      <div onClick={() => {
                        if (!isRead) {
                          markNotifRead(notifId);
                        }if (type === 'REQUEST_CREATED' || type === 'REQUEST_UPDATED') {
                          navigate('/requests');
                        } else if (type === 'REVIEW_CREATED' && n.itemId) {
                          navigate(`/listings/${n.itemId}`);
                        } else {
                          navigate('/profile/reviews');
                        }
                      }}
                        className={`group flex gap-3 p-[15px] sm:p-5 relative transition-all duration-200 cursor-pointer ${!isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-white/40'}`}>
                        <div className={`w-10 h-10 rounded-[12px] flex-shrink-0 flex items-center justify-center ${m.bgCls} ${m.colorCls}`}>
                          <Icon name={m.icon} size={20} stroke={1.9} />
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                           <div className="flex justify-between gap-2">
                            <span className="font-extrabold text-[14px] text-ink">{n.title}</span>
                            <span className="text-faint text-[11.5px] font-semibold whitespace-nowrap">
                              {n.createdAt || n.updatedAt ? new Date(n.createdAt || n.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                            </span>
                          </div>
                          <div className="text-muted text-[13px] mt-0.5 leading-relaxed">{n.message}</div>
                        </div>

                        {!isRead && (
                          <div className="absolute top-1/2 -translate-y-1/2 right-3.5 flex items-center">
                            {/* Blue unread dot - hides on hover */}
                            <div className="w-2 h-2 rounded-full bg-primary group-hover:opacity-0 transition-opacity" />
                            
                            {/* Checkmark button - shows on hover */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotifRead(notifId);
                              }}
                              className="absolute right-0 p-1.5 bg-white text-primary rounded-full shadow-sm2 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white transition-all transform scale-90 group-hover:scale-100"
                              title="Mark as read"
                            >
                              <Icon name="check" size={16} stroke={2.5} />
                            </button>
                          </div>
                        )}
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
