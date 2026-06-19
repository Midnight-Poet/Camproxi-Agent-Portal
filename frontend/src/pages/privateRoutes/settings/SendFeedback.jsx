import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';

const KINDS = [
  ['idea', 'Idea', 'bolt'],
  ['bug', 'Bug', 'info'],
  ['other', 'Other', 'message'],
];

export default function SendFeedback() {
  const navigate = useNavigate();
  const { flash } = useApp();
  const [kind, setKind] = useState('idea');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <AppBar title="Send feedback" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-6 pt-4">
            <p className="text-muted text-[14.5px] leading-relaxed mb-5">We read every message. Tell us what's working and what we can make better for agents.</p>

            <div className="text-[13px] font-bold text-camtext mb-1.5">What's this about?</div>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {KINDS.map(([id, label, icon]) => {
                const on = kind === id;
                return (
                  <button key={id} onClick={() => setKind(id)}
                    className={`cursor-pointer p-3.5 rounded-md2 flex flex-col items-center gap-2 transition-all border-[1.5px] ${
                      on ? 'border-primary bg-primary-tint' : 'border-line bg-white'
                    }`}>
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${on ? 'bg-primary text-white' : 'bg-primary-50 text-primary-700'}`}>
                      <Icon name={icon} size={19} color={on ? '#fff' : '#084f49'} />
                    </div>
                    <span className="font-bold text-[13px] text-ink">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[13px] font-bold text-camtext mb-1.5">How's your experience so far?</div>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}
                  className={`flex-1 flex justify-center py-3 cursor-pointer rounded-[12px] border-[1.5px] transition-all ${n <= rating ? 'bg-primary-tint border-primary/40' : 'bg-white border-line'}`}>
                  <Icon name="star" size={24} color={n <= rating ? '#0d7a72' : '#e7edec'}
                    style={{ fill: n <= rating ? '#0d7a72' : 'none' }} />
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-bold text-camtext mb-1.5">Tell us more</label>
              <textarea
                className="w-full text-[15px] text-ink bg-white border-[1.5px] border-line rounded-md2 px-3.5 py-3 resize-none leading-relaxed transition-all focus:border-primary placeholder:text-faint"
                rows={5}
                placeholder="Share details, ideas or anything on your mind…"
                value={text} onChange={e => setText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-none px-5 py-3.5 bg-white border-t border-line" >
          <button
            className="w-full py-4 font-bold text-base text-white bg-primary rounded-md2 cursor-pointer disabled:opacity-45 hover:bg-primary-600 transition-colors"
            style={{ boxShadow: '0 3px 10px rgba(13,122,114,0.28)' }}
            disabled={!text.trim()}
            onClick={() => { flash('Thanks for the feedback!'); navigate('/profile'); }}>
            Send feedback
          </button>
        </div>
      </div>
    </Layout>
  );
}
