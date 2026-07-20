import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '../../../components/Switch';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';

import NotifToggle from '../../../components/settings/NotifToggle';

export default function NotifSettings() {
  const navigate = useNavigate();
  const { flash } = useApp();
  const [s, setS] = useState({ req: true, msg: true, approve: true, views: false, payout: true, tips: false, pushAll: true, emailAll: true });
  const set = k => v => { setS(p => ({ ...p, [k]: v })); flash('Preference saved'); };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <AppBar title="Notification settings" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7 pt-4">
            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">Channels</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-4">
              <NotifToggle icon="bell"  label="Push notifications"  sub="On this device"        on={s.pushAll}  onChange={set('pushAll')} />
              <NotifToggle icon="mail"  label="Email notifications" sub="adaeze@sunrise.ng"     on={s.emailAll} onChange={set('emailAll')} last />
            </div>

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">Activity</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-4">
              <NotifToggle icon="requests" label="Reservation requests" sub="When a student wants to book"   on={s.req}     onChange={set('req')} />
              <NotifToggle icon="message"  label="New messages"         sub="Replies from students"          on={s.msg}     onChange={set('msg')} />
              <NotifToggle icon="check"    label="Listing approvals"    sub="When a listing goes live"       on={s.approve} onChange={set('approve')} />
              <NotifToggle icon="eye"      label="Weekly views digest"  sub="Profile & listing view summary" on={s.views}   onChange={set('views')} last />
            </div>

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">More</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden">
              <NotifToggle icon="card" label="Payout updates" sub="Transfers & balance changes"     on={s.payout} onChange={set('payout')} />
              <NotifToggle icon="bolt" label="Tips & product news" sub="Occasional, never spammy" on={s.tips}   onChange={set('tips')} last />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
