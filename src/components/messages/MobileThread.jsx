import { useState, useRef, useEffect } from 'react';
import Icon from '../Icon';
import Avatar from '../Avatar';
import Bubble from './Bubble';

export default function MobileThread({ chat, onBack, onSend }) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages.length]);

  const send = () => {
    if (!draft.trim()) return;
    onSend(chat.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* header */}
      <header className="flex-none flex items-center gap-3 px-4 pt-4 pb-3.5 glass border-b border-white/40 relative z-10">
        <button onClick={onBack} aria-label="Back"
          className="w-9 h-9 flex-shrink-0 rounded-[12px] border-[1.5px] border-black/10 bg-white/60 text-camtext cursor-pointer flex items-center justify-center hover:bg-white transition-colors">
          <Icon name="chevronLeft" size={20} />
        </button>
        <div className="relative flex-shrink-0">
          <Avatar color={chat.avatar} name={chat.name} size={38} />
          {chat.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-ok border-2 border-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15.5px] font-extrabold text-ink leading-tight truncate">{chat.name}</div>
          <div className={`text-[12px] font-semibold leading-tight ${chat.online ? 'text-ok' : 'text-faint'}`}>
            {chat.online ? 'Online now' : 'Offline'}
          </div>
        </div>
        <button aria-label="Call"
          className="w-9 h-9 flex-shrink-0 rounded-[12px] border-[1.5px] border-black/10 bg-white/60 text-muted cursor-pointer flex items-center justify-center hover:bg-white transition-colors">
          <Icon name="phone" size={18} />
        </button>
      </header>

      {/* listing strip */}
      <div className="flex-none flex items-center gap-2.5 px-4 py-2.5 bg-primary-tint border-b border-line2">
        <Icon name="tag" size={14} color="#084f49" />
        <span className="text-[13px] font-bold text-primary-700 truncate">Re: {chat.listing}</span>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-transparent px-4 py-5">
        <div className="flex flex-col gap-3">
          <div className="text-center text-[11.5px] font-bold text-faint uppercase tracking-widest mb-1">Today</div>
          {chat.messages.map((m, i) => <Bubble key={i} m={m} />)}
        </div>
      </div>

      {/* composer */}
      <div className="flex-none flex items-end gap-2.5 px-3.5 py-3 glass border-t border-white/40 relative z-10">
        <button aria-label="Add photo"
          className="w-10 h-10 flex-shrink-0 rounded-[13px] border-[1.5px] border-black/10 bg-white/60 text-muted cursor-pointer flex items-center justify-center hover:bg-white transition-colors">
          <Icon name="camera" size={19} />
        </button>
          <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={1}
          placeholder="Message…"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          className="flex-1 resize-none border-[1.5px] border-black/10 rounded-[16px] px-4 py-3 font-[inherit] text-[14.5px] leading-[1.4] max-h-24 bg-white/60 backdrop-blur-sm text-ink outline-none focus:border-primary focus:bg-white transition-all font-medium"
        />
        <button onClick={send} disabled={!draft.trim()} aria-label="Send"
          className={`w-10 h-10 flex-shrink-0 rounded-[13px] border-none flex items-center justify-center transition-all ${
            draft.trim() ? 'bg-gradient-to-br from-primary to-primary-600 cursor-pointer hover:shadow-glow' : 'bg-line cursor-default opacity-50'
          }`}>
          <Icon name="send" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}
