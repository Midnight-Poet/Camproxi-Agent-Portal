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
      <div className="flex flex-col h-full">
        <AppBar title="Verification" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7 pt-4">
            {/* Status banner */}
            <div className="bg-white rounded-card border border-line2 shadow-sm2 p-5 text-center mb-4" style={{ background: '#e6f5ee', borderColor: 'rgba(31,157,107,0.3)' }}>
              <div className="w-14 h-14 rounded-[18px] mx-auto mb-3 bg-ok flex items-center justify-center">
                <Icon name="shield" size={28} color="#fff" />
              </div>
              <div className="font-extrabold text-[18px] text-ink">You're verified</div>
              <div className="text-muted text-[13.5px] mt-0.5">Verified on 12 Mar 2026 · valid for 12 months</div>
            </div>

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">What's verified</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-4">
              {checks.map((c, i) => (
                <div key={c.label} className={`flex items-center gap-3.5 px-[15px] py-3.5 ${i < checks.length - 1 ? 'border-b border-line2' : ''}`}>
                  <div className={`w-[34px] h-[34px] rounded-full flex-shrink-0 flex items-center justify-center ${c.done ? 'bg-ok-bg text-ok' : 'bg-warn-bg text-warn'}`}>
                    <Icon name={c.done ? 'check' : 'clock'} size={18} stroke={2.4} color={c.done ? '#1f9d6b' : '#c8821a'} />
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

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">Documents on file</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 flex items-center gap-3 p-3.5 mb-4">
              <div className="w-[42px] h-[42px] rounded-[10px] bg-primary-50 text-primary flex items-center justify-center">
                <Icon name="doc" size={22} color="#0d7a72" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-ink">Govt_ID_verification.pdf</div>
                <div className="text-muted text-[12px]">Uploaded 12 Mar 2026</div>
              </div>
              <button onClick={() => flash('Document replaced')}
                className="px-3 py-2 text-[13.5px] font-bold text-camtext bg-white border border-line rounded-sm2 cursor-pointer">Replace</button>
            </div>

            <button onClick={() => flash('Address proof uploaded')}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-camtext bg-white border border-line rounded-md2 cursor-pointer hover:bg-bg transition-colors">
              <Icon name="upload" size={18} /> Upload address proof
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
