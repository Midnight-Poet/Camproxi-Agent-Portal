import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import AppBar from '../../components/AppBar';
import Avatar from '../../components/Avatar';
import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';
import MobileThread from '../../components/messages/MobileThread';
import ChatListRow from '../../components/messages/ChatListRow';
import DesktopPane from '../../components/messages/DesktopPane';

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
