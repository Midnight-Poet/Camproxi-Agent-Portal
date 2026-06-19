import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';

const HELP_FAQS = [
  { q: 'How do I get my listing approved?', a: "Submit your listing with clear photos and accurate details. Our team reviews within 24 hours and you'll get a notification once it's live." },
  { q: 'When do I receive payouts?', a: 'Payouts follow your chosen schedule in Payout details. Funds clear to your linked bank account 1–2 business days after a reservation is confirmed.' },
  { q: 'How does verification work?', a: 'We confirm your identity, business and contact details using the documents you upload. A verified badge builds trust with students.' },
  { q: 'Can I pause a listing temporarily?', a: 'Yes — toggle availability off on any listing to mark it as taken. It stays in your account and can be reactivated anytime.' },
  { q: "A student isn't responding — what do I do?", a: 'Requests auto-expire after 48 hours. You can decline a stale request to free up the slot, or message the student directly.' },
];

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-line2">
      <button onClick={onToggle} className="flex items-center gap-3 p-[15px] w-full text-left border-none bg-none cursor-pointer hover:bg-bg transition-colors">
        <span className="flex-1 font-bold text-[14.5px] text-ink leading-[1.35]">{q}</span>
        <Icon name="chevronDown" size={18} color="#93a4a0"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      {open && (
        <div className="text-muted text-[13.5px] leading-relaxed px-[15px] pb-4 animate-fadeUp">{a}</div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const navigate = useNavigate();
  const { flash } = useApp();
  const [openIdx, setOpenIdx] = useState(0);
  const [q, setQ] = useState('');
  const list = HELP_FAQS.filter(f => f.q.toLowerCase().includes(q.toLowerCase()));

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <AppBar title="Help center" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7 pt-4">
            <div className="relative mb-[18px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" size={18} /></span>
              <input
                className="w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 pl-[40px] transition-all focus:border-primary placeholder:text-faint"
                placeholder="Search help articles"
                value={q} onChange={e => setQ(e.target.value)}
              />
            </div>

            <div className="text-[11px] font-extrabold tracking-[0.09em] uppercase text-primary mb-2.5">Popular questions</div>
            <div className="bg-white rounded-card border border-line2 shadow-sm2 overflow-hidden mb-4">
              {list.length ? list.map((f, i) => (
                <FaqItem key={f.q} {...f} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
              )) : (
                <div className="text-muted text-[13.5px] text-center p-[18px]">No articles match "{q}".</div>
              )}
            </div>

            <div className="bg-white rounded-card border border-line2 shadow-sm2 p-[18px] text-center">
              <div className="w-12 h-12 rounded-[14px] mx-auto mb-3 bg-primary-50 text-primary flex items-center justify-center">
                <Icon name="message" size={24} color="#0d7a72" />
              </div>
              <div className="font-extrabold text-base text-ink">Still need help?</div>
              <div className="text-muted text-[13.5px] mt-1 mb-3.5">Our support team replies within a few hours.</div>
              <button onClick={() => flash('Opening chat…')}
                className="w-full py-3.5 font-bold text-white bg-primary rounded-md2 cursor-pointer hover:bg-primary-600 transition-colors"
                style={{ boxShadow: '0 3px 10px rgba(13,122,114,0.28)' }}>
                Chat with support
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
