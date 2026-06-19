import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import AppBar from '../../components/AppBar';
import Avatar from '../../components/Avatar';
import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';

/* ── Shared bubble ─────────────────────────────────────────────────────────── */
function Bubble({ m }) {
  const mine = m.from === 'me';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[74%] md:max-w-[64%]">
        <div className={`px-[14px] py-[10px] text-[14.5px] leading-[1.45] ${
          mine
            ? 'bg-primary text-white rounded-[18px_18px_5px_18px]'
            : 'bg-white text-ink border border-line rounded-[18px_18px_18px_5px] shadow-sm'
        }`}>
          {m.text}
        </div>
        <div className={`text-[11px] font-semibold text-faint mt-1 px-1 ${mine ? 'text-right' : 'text-left'}`}>
          {m.when}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile thread (no Layout — rendered inside MessagesPage Layout) ───────── */
function MobileThread({ chat, onBack, onSend }) {
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
    <div className="flex flex-col h-full">
      {/* header */}
      <header className="flex-none flex items-center gap-3 px-4 pt-4 pb-3.5 bg-white border-b border-line">
        <button onClick={onBack} aria-label="Back"
          className="w-9 h-9 flex-shrink-0 rounded-[11px] border border-line bg-white text-camtext cursor-pointer flex items-center justify-center">
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
          className="w-9 h-9 flex-shrink-0 rounded-[11px] border border-line bg-white text-muted cursor-pointer flex items-center justify-center">
          <Icon name="phone" size={18} />
        </button>
      </header>

      {/* listing strip */}
      <div className="flex-none flex items-center gap-2.5 px-4 py-2.5 bg-primary-tint border-b border-line2">
        <Icon name="tag" size={14} color="#084f49" />
        <span className="text-[13px] font-bold text-primary-700 truncate">Re: {chat.listing}</span>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-bg px-4 py-5">
        <div className="flex flex-col gap-3">
          <div className="text-center text-[11.5px] font-bold text-faint uppercase tracking-widest mb-1">Today</div>
          {chat.messages.map((m, i) => <Bubble key={i} m={m} />)}
        </div>
      </div>

      {/* composer */}
      <div className="flex-none flex items-end gap-2.5 px-3.5 py-3 bg-white border-t border-line">
        <button aria-label="Add photo"
          className="w-10 h-10 flex-shrink-0 rounded-[13px] border border-line bg-white text-muted cursor-pointer flex items-center justify-center">
          <Icon name="camera" size={19} />
        </button>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={1}
          placeholder="Message…"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          className="flex-1 resize-none border border-line rounded-[16px] px-3.5 py-2.5 font-[inherit] text-[14.5px] leading-[1.4] max-h-24 bg-bg text-ink outline-none focus:border-primary transition-colors"
        />
        <button onClick={send} disabled={!draft.trim()} aria-label="Send"
          className={`w-10 h-10 flex-shrink-0 rounded-[13px] border-none flex items-center justify-center transition-colors ${
            draft.trim() ? 'bg-primary cursor-pointer' : 'bg-line cursor-default'
          }`}>
          <Icon name="send" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}

/* ── Mobile conversation list ───────────────────────────────────────────────── */
function ChatListRow({ c, onClick }) {
  const last = c.messages[c.messages.length - 1];
  const preview = (last.from === 'me' ? 'You: ' : '') + last.text;
  return (
    <button onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 w-full text-left border-none bg-transparent cursor-pointer border-b border-line2 font-[inherit] hover:bg-bg transition-colors">
      <div className="relative flex-shrink-0">
        <Avatar color={c.avatar} name={c.name} size={50} />
        {c.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-ok border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-[15px] text-ink truncate">{c.name}</span>
          <span className="ml-auto text-[12px] text-faint font-semibold flex-shrink-0">{c.when}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Icon name="tag" size={11} color="#084f49" />
          <span className="text-[11.5px] font-bold text-primary-700 truncate max-w-[160px]">{c.listing}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[13px] leading-snug truncate flex-1 ${c.unread ? 'font-bold text-ink' : 'font-normal text-muted'}`}>
            {preview}
          </span>
          {c.unread > 0 && (
            <span className="flex-shrink-0 min-w-[19px] h-[19px] px-1 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center">
              {c.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── Desktop two-pane ─────────────────────────────────────────────────────── */
function DesktopPane({ chats, activeId, onOpen, onSend }) {
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
      <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-line bg-white">
        <div className="px-4 py-4 border-b border-line">
          <h2 className="text-[18px] font-extrabold text-ink mb-3">Messages</h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"><Icon name="search" size={16} /></span>
            <input
              className="w-full text-[13.5px] bg-bg border border-line rounded-[11px] pl-9 pr-3.5 py-2.5 outline-none focus:border-primary transition-colors placeholder:text-faint"
              placeholder="Search students or listings"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length ? filtered.map(c => (
            <button key={c.id} onClick={() => onOpen(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-none cursor-pointer border-b border-line2 font-[inherit] transition-colors ${
                active && c.id === active.id ? 'bg-primary-50' : 'bg-white hover:bg-bg'
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
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-none flex items-center gap-3 px-6 py-4 bg-white border-b border-line">
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
              className="w-9 h-9 flex-shrink-0 rounded-[11px] border border-line bg-white text-muted cursor-pointer flex items-center justify-center hover:bg-bg transition-colors">
              <Icon name="phone" size={17} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-bg px-6 py-5">
            <div className="flex flex-col gap-3.5 max-w-[820px] mx-auto">
              <div className="text-center text-[11.5px] font-bold text-faint uppercase tracking-widest mb-1">Today</div>
              {active.messages.map((m, i) => <Bubble key={i} m={m} />)}
            </div>
          </div>

          <div className="flex-none flex items-end gap-3 px-5 py-4 bg-white border-t border-line">
            <button aria-label="Add photo"
              className="w-10 h-10 flex-shrink-0 rounded-[13px] border border-line bg-white text-muted cursor-pointer flex items-center justify-center hover:bg-bg transition-colors">
              <Icon name="camera" size={19} />
            </button>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={1}
              placeholder={`Message ${active.name.split(' ')[0]}…`}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              className="flex-1 resize-none border border-line rounded-[16px] px-3.5 py-2.5 font-[inherit] text-[14.5px] leading-[1.4] max-h-24 bg-bg text-ink outline-none focus:border-primary transition-colors"
            />
            <button onClick={send} disabled={!draft.trim()}
              className={`h-[46px] px-5 rounded-[13px] font-bold text-[14px] text-white flex items-center gap-2 flex-shrink-0 transition-colors ${
                draft.trim() ? 'bg-primary cursor-pointer hover:bg-primary-600' : 'bg-line cursor-default'
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

/* ── Route component ─────────────────────────────────────────────────────── */
export default function MessagesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, openChatThread, sendChat } = useApp();
  const [q, setQ] = useState('');

  const openChat = (chatId) => {
    openChatThread(chatId);
    navigate(`/messages/${chatId}`);
  };

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.listing.toLowerCase().includes(q.toLowerCase())
  );
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  // On mobile with a thread open: hide tab bar, show full-screen thread
  if (id) {
    const chat = chats.find(c => c.id === id);
    if (!chat) { navigate('/messages'); return null; }
    return (
      <Layout hideTabBar>
        {/* mobile: full-screen thread */}
        <div className="md:hidden h-full">
          <MobileThread chat={chat} onBack={() => navigate('/messages')} onSend={sendChat} />
        </div>
        {/* desktop: two-pane, thread pre-selected */}
        <div className="hidden md:flex h-full">
          <DesktopPane
            chats={chats}
            activeId={id}
            onOpen={(chatId) => { openChatThread(chatId); navigate(`/messages/${chatId}`); }}
            onSend={sendChat}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* mobile: list */}
      <div className="md:hidden flex flex-col h-full">
        <AppBar
          title="Messages"
          sub={totalUnread ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up'}
        />
        <div className="flex-none px-4 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"><Icon name="search" size={17} /></span>
            <input
              className="w-full text-[14px] bg-white border border-line rounded-[13px] pl-10 pr-3.5 py-2.5 outline-none focus:border-primary transition-colors placeholder:text-faint"
              placeholder="Search students or listings"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length ? filtered.map(c => (
            <ChatListRow key={c.id} c={c} onClick={() => openChat(c.id)} />
          )) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-center">
              <Icon name="chat" size={44} color="#c8d6d4" />
              <div className="text-[15px] font-bold text-ink">No conversations</div>
              <div className="text-[13.5px] text-muted">Nothing matches "{q}".</div>
            </div>
          )}
        </div>
      </div>

      {/* desktop: two-pane, no pre-selected thread */}
      <div className="hidden md:flex h-full">
        <DesktopPane
          chats={chats}
          activeId={undefined}
          onOpen={(chatId) => { openChatThread(chatId); navigate(`/messages/${chatId}`); }}
          onSend={sendChat}
        />
      </div>
    </Layout>
  );
}
