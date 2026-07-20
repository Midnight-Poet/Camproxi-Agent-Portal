import { useState, useRef, useEffect } from 'react';
import Icon from '../Icon';
import Avatar from '../Avatar';
import Bubble from './Bubble';

export default function DesktopPane({ chats, activeId, onOpen, onSend }) {
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);
  const active = chats.find(c => c.id === activeId) || chats[0];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.id, active?.messages.length]);

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.listing.toLowerCase().includes(q.toLowerCase())
  );

  const send = () => {
    if (!draft.trim()) return;
    onSend(active.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="flex h-full">
      {/* left: conversation list */}
      <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-white/40 glass">
        <div className="px-4 py-4 border-b border-white/40">
          <h2 className="text-[18px] font-extrabold text-ink mb-3">Messages</h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"><Icon name="search" size={16} /></span>
            <input
              className="w-full text-[13.5px] bg-white/40 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[12px] pl-9 pr-3.5 py-2.5 outline-none focus:border-primary focus:bg-white placeholder:text-faint transition-all font-medium"
              placeholder="Search students or listings"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length ? filtered.map(c => (
            <button key={c.id} onClick={() => onOpen(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-none cursor-pointer border-b border-white/40 font-[inherit] transition-colors ${
                active && c.id === active.id ? 'bg-white/60 shadow-sm' : 'bg-transparent hover:bg-black/5'
              }`}>
              <div className="relative flex-shrink-0">
                <Avatar color={c.avatar} name={c.name} size={44} />
                {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-ok border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold text-[14px] text-ink truncate">{c.name}</span>
                  <span className="ml-auto text-[11.5px] text-faint font-semibold flex-shrink-0">{c.when}</span>
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon name="tag" size={11} color="#084f49" />
                  <span className="text-[11px] font-bold text-primary-700 truncate">{c.listing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[12.5px] leading-snug truncate flex-1 ${c.unread ? 'font-bold text-ink' : 'font-normal text-muted'}`}>
                    {(c.messages[c.messages.length - 1].from === 'me' ? 'You: ' : '') + c.messages[c.messages.length - 1].text}
                  </span>
                  {c.unread > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10.5px] font-extrabold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )) : (
            <div className="px-6 py-8 text-center text-[13.5px] text-faint">No conversations match "{q}".</div>
          )}
        </div>
      </div>

      {/* right: thread */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">
          <div className="flex-none flex items-center gap-3 px-6 py-4 glass border-b border-white/40 relative z-10">
            <div className="relative flex-shrink-0">
              <Avatar color={active.avatar} name={active.name} size={44} />
              {active.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-ok border-2 border-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-extrabold text-ink leading-tight">{active.name}</div>
              <div className={`text-[12.5px] font-semibold leading-tight ${active.online ? 'text-ok' : 'text-faint'}`}>
                {active.online ? 'Online now' : 'Offline'}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[11px] bg-primary-tint">
              <Icon name="tag" size={14} color="#084f49" />
              <span className="text-[13px] font-bold text-primary-700">{active.listing}</span>
            </div>
            <button aria-label="Call"
              className="w-9 h-9 flex-shrink-0 rounded-[12px] border-[1.5px] border-black/10 bg-white/60 text-muted cursor-pointer flex items-center justify-center hover:bg-white transition-colors">
              <Icon name="phone" size={17} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-transparent px-6 py-5">
            <div className="flex flex-col gap-3.5 max-w-[820px] mx-auto">
              <div className="text-center text-[11.5px] font-bold text-faint uppercase tracking-widest mb-1">Today</div>
              {active.messages.map((m, i) => <Bubble key={i} m={m} />)}
            </div>
          </div>

          <div className="flex-none flex items-end gap-3 px-5 py-4 glass border-t border-white/40 relative z-10">
            <button aria-label="Add photo"
              className="w-10 h-10 flex-shrink-0 rounded-[13px] border-[1.5px] border-black/10 bg-white/60 text-muted cursor-pointer flex items-center justify-center hover:bg-white transition-colors">
              <Icon name="camera" size={19} />
            </button>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={1}
              placeholder={`Message ${active.name.split(' ')[0]}…`}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              className="flex-1 resize-none border-[1.5px] border-black/10 rounded-[16px] px-4 py-3 font-[inherit] text-[14.5px] leading-[1.4] max-h-24 bg-white/60 backdrop-blur-sm text-ink outline-none focus:border-primary focus:bg-white transition-all font-medium"
            />
            <button onClick={send} disabled={!draft.trim()}
              className={`h-[46px] px-5 rounded-[13px] font-bold text-[14px] text-white flex items-center gap-2 flex-shrink-0 transition-all ${
                draft.trim() ? 'bg-gradient-to-r from-primary to-primary-600 cursor-pointer hover:shadow-glow' : 'bg-line cursor-default opacity-50'
              }`}>
              Send <Icon name="send" size={17} color="#fff" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <Icon name="chat" size={48} color="#c8d6d4" />
          <div className="text-[17px] font-extrabold text-ink">No conversation selected</div>
          <div className="text-[14px] text-muted">Pick a student from the list to start chatting.</div>
        </div>
      )}
    </div>
  );
}
