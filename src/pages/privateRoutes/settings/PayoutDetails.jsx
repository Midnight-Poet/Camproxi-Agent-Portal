import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';

export default function PayoutDetails() {
  const navigate = useNavigate();
  const { flash } = useApp();
  const [schedule, setSchedule] = useState('weekly');
  const [hasBank, setHasBank] = useState(true);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <AppBar title="Payout details" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7 pt-4">
            {/* Balance card */}
            <div className="rounded-card p-6 mb-5 text-white border-none shadow-sm" style={{ backgroundColor: '#0d7a72' }}>
              <div className="text-[13px] font-bold text-white/75">Available balance</div>
              <div className="text-[34px] font-black tracking-[-0.02em] my-1 mb-4">₦248,500</div>
              <div className="flex justify-between items-center">
                <div className="text-[12.5px] text-white/80 flex items-center gap-1">
                  <Icon name="clock" size={13} color="rgba(255,255,255,0.8)" />
                  Next payout Fri, 5 Jun
                </div>
                <button onClick={() => flash('Payout requested')}
                  className="px-4 py-2 text-[13px] font-bold text-white cursor-pointer rounded-[10px]"
                  style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  Withdraw now
                </button>
              </div>
            </div>

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">Bank account</div>
            {hasBank ? (
              <div className="bg-white rounded-card border border-line2 shadow-sm2 flex items-center gap-3.5 p-4 mb-4">
                <div className="w-11 h-11 rounded-[12px] bg-primary-50 text-primary-700 flex items-center justify-center">
                  <Icon name="card" size={22} color="#084f49" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14.5px] text-ink">GTBank · Adaeze Okafor</div>
                  <div className="text-muted text-[13px]">•••• •••• 0199</div>
                </div>
                <button onClick={() => flash('Edit bank details')}
                  className="px-3 py-2 text-[13.5px] font-bold text-camtext bg-white border border-line rounded-sm2 cursor-pointer">Edit</button>
              </div>
            ) : (
              <button onClick={() => setHasBank(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-camtext bg-white border border-line rounded-md2 cursor-pointer mb-4 hover:bg-bg transition-colors">
                <Icon name="plus" size={18} /> Add bank account
              </button>
            )}

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">Payout schedule</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden">
              {[
                ['weekly', 'Weekly', 'Every Friday'],
                ['monthly', 'Monthly', '1st of each month'],
                ['manual', 'Manual', 'Withdraw whenever you like'],
              ].map(([id, label, sub], i) => (
                <button key={id} onClick={() => { setSchedule(id); flash('Schedule updated'); }}
                  className={`flex items-center gap-3.5 px-[15px] py-3.5 w-full text-left border-none bg-none cursor-pointer hover:bg-bg transition-colors ${i < 2 ? 'border-b border-line2' : ''}`}>
                  <div className="flex-1">
                    <div className="font-bold text-[14.5px] text-ink">{label}</div>
                    <div className="text-muted text-[12.5px]">{sub}</div>
                  </div>
                  <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${schedule === id ? 'bg-primary' : 'bg-transparent border-2 border-line'}`}>
                    {schedule === id && <Icon name="check" size={13} color="#fff" stroke={3} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
