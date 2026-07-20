import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';

const checks = [
  { label: 'Identity', sub: 'Government ID confirmed', done: true },
  { label: 'Business', sub: 'CAC certificate confirmed', done: true },
  { label: 'Contact', sub: 'Email & phone confirmed', done: true },
  { label: 'Address', sub: 'Proof of campus-area address', done: false },
];

export default function Verification() {
  const navigate = useNavigate();
  const { flash } = useApp();

  return (
    <Layout>
      <div className="flex flex-col h-full bg-transparent">
        <AppBar title="Verification" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7 pt-4">
            {/* Status banner */}
            <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm p-6 text-center mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-ok/10 to-transparent pointer-events-none" />
              <div className="w-16 h-16 rounded-[20px] mx-auto mb-4 bg-gradient-to-br from-ok to-[#168558] flex items-center justify-center relative z-10 shadow-[0_4px_12px_rgba(31,157,107,0.3)]">
                <Icon name="shield" size={32} color="#fff" />
              </div>
              <div className="font-extrabold text-[20px] text-ink relative z-10">You're verified</div>
              <div className="text-muted text-[13.5px] mt-1 relative z-10">Verified on 12 Mar 2026 · valid for 12 months</div>
            </div>

            <div className="text-[12px] font-extrabold tracking-[0.09em] uppercase text-primary mb-3">What's verified</div>
            <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden mb-5">
              {checks.map((c, i) => (
                <div key={c.label} className={`flex items-center gap-4 px-5 py-4 ${i < checks.length - 1 ? 'border-b border-white/40' : ''}`}>
                  <div className={`w-[38px] h-[38px] rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${c.done ? 'bg-gradient-to-br from-ok to-[#168558] text-white' : 'bg-gradient-to-br from-warn to-[#a36915] text-white'}`}>
                    <Icon name={c.done ? 'check' : 'clock'} size={20} stroke={2.4} color="#fff" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[14.5px] text-ink">{c.label}</div>
                    <div className="text-muted text-[12.5px]">{c.sub}</div>
                  </div>
                  <span className={`text-[12px] font-extrabold ${c.done ? 'text-ok' : 'text-warn'}`}>
                    {c.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[12px] font-extrabold tracking-[0.09em] uppercase text-primary mb-3">Documents on file</div>
            <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm flex items-center gap-4 p-4 mb-5">
              <div className="w-[46px] h-[46px] rounded-[16px] bg-primary/10 text-primary flex items-center justify-center">
                <Icon name="doc" size={22} color="#0d7a72" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-ink">Govt_ID_verification.pdf</div>
                <div className="text-muted text-[12px]">Uploaded 12 Mar 2026</div>
              </div>
              <button onClick={() => flash('Document replaced')}
                className="px-4 py-2 text-[13.5px] font-bold text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[12px] cursor-pointer hover:bg-white transition-all">Replace</button>
            </div>

            <button onClick={() => flash('Address proof uploaded')}
              className="w-full flex items-center justify-center gap-2 py-4 font-bold text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[16px] cursor-pointer hover:bg-white transition-all shadow-sm">
              <Icon name="upload" size={18} /> Upload address proof
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
