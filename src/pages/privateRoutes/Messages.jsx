import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Avatar from '../../components/Avatar';
import Icon from '../../components/Icon';
import Bubble from '../../components/messages/Bubble';
import { useApp } from '../../context/AppContext';
import { useGetChatMessagesQuery, useMarkChatReadMutation } from '../../redux/api/chatApiSlice';

const isMine = (m) => m.senderType === 'AGENT' || m.from === 'me';
const isSystemMsg = (m) => {
  const text = m.content || m.text || '';
  return text.toLowerCase().includes('started a conversation');
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  if (isNaN(date1) || isNaN(date2)) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const getDemarcation = (dateStr) => {
  if (!dateStr) return 'Conversation Started';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Conversation Started';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const diffTime = today - msgDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  }
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export default function MessagesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, openChatThread, sendChat, flash } = useApp();
  
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeChat = id ? chats.find(c => c.id === id || c._id === id) : null;
  const activeIdString = activeChat?.id || activeChat?._id;

  const { data: messagesData, refetch: refetchMessages } = useGetChatMessagesQuery(activeIdString, { skip: !activeIdString, pollingInterval: 1000 });
  const [markRead] = useMarkChatReadMutation();

  const activeMessages = [...(messagesData || [])].sort((a, b) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    if (!isNaN(tA) && !isNaN(tB)) {
      return tA - tB;
    }
    const idA = (a._id || a.id || '').toString();
    const idB = (b._id || b.id || '').toString();
    if (idA < idB) return -1;
    if (idA > idB) return 1;
    return 0;
  }).filter(m => !isSystemMsg(m));

  const hasStudentMessage = activeMessages.some(m => !isMine(m));

  const activeChatUnread = (activeChat?.messages || []).filter(m => m.senderType === 'STUDENT' && !m.isRead).length;

  useEffect(() => {
    if (activeIdString && activeChatUnread > 0) {
      markRead(activeIdString);
    }
  }, [activeIdString, activeChatUnread, markRead]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeIdString, activeMessages.length]);

  const openChat = (chatId) => {
    openChatThread(chatId);
    navigate(`/messages/${chatId}`);
  };

  const send = () => {
    if (!draft.trim() || !activeIdString) return;
    sendChat(activeIdString, draft.trim());
    setDraft('');
    setTimeout(() => {
      refetchMessages();
    }, 200);
  };

  const filteredChats = chats.filter(c =>
    (c.student?.firstName || c.name || '').toLowerCase().includes(q.toLowerCase()) ||
    (c.item?.name || c.listing || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Layout hideTabBar={!!id}>
      <div className="flex h-full bg-bg overflow-hidden md:rounded-card relative z-10 shadow-sm2 border">
        {/* LEFT PANE: Chat List */}
        <div className={`w-full md:w-[340px] lg:w-[360px] flex-shrink-0 flex-col bg-surface border-r border-line ${id ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-5 py-4 border-b border-line sticky top-0 z-20 bg-surface/90 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[22px] font-bold text-ink tracking-tight">Messages</h2>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <Icon name="search" size={17} />
              </span>
              <input
                className="w-full text-[14.5px] bg-bg border border-transparent rounded-[12px] pl-10 pr-4 py-2.5 outline-none focus:bg-surface focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all text-ink placeholder:text-muted font-medium shadow-sm"
                placeholder="Search students or listings"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-hide">
            {filteredChats.length ? filteredChats.map(c => {
              const cId = c.id || c._id;
              const name = c.student ? `${c.student.firstName} ${c.student.lastName}` : (c.name || 'Student');
              // const campus = c.student ? c.student.campus : ''
              const avatar = c.student?.profileImage?.url || c.avatar;
              const listingName = c.item?.name || c.listing || 'Listing';
              const unread = (c.messages || []).filter(m => m.senderType === 'STUDENT' && !m.isRead).length;
              const rawLastMsg = c.lastMessage;
              const validMessages = (c.messages || []).filter(m => !isSystemMsg(m));
              const lastMsg = validMessages.length > 0 ? validMessages[validMessages.length - 1] : (rawLastMsg && !isSystemMsg(rawLastMsg) ? rawLastMsg : null);
              const when = lastMsg?.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : (c.when || '');
              const isActive = cId === activeIdString;

              return (
                <button key={cId} onClick={() => openChat(cId)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-[16px] text-left cursor-pointer transition-all duration-200 group ${
                    isActive ? 'bg-primary/5 shadow-sm border border-primary/10' : 'bg-transparent border border-transparent hover:bg-bg'
                  }`}>
                  <div className="relative flex-shrink-0 shadow-sm2 rounded-full">
                    <Avatar color="#0d7a72" name={name} url={avatar} size={50} />
                    {c.online && <span className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full bg-ok border-[3px] border-surface shadow-sm2" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="font-semibold text-[15px] text-ink tracking-tight truncate pr-2">{name}</span>
                      <span className={`text-[12px] font-medium flex-shrink-0 ${unread ? 'text-primary font-bold' : 'text-muted'}`}>{when}</span>
                    </div>
                    {/* <div className="flex items-center gap-1.5 mb-1">
                      <Icon name="tag" size={12} color="#0d7a72" />
                      <span className="text-[12.5px] font-medium text-primary-600 truncate">{listingName}</span>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] leading-snug truncate flex-1 ${unread ? 'font-bold text-ink' : 'font-medium text-muted'}`}>
                        {lastMsg ? ((lastMsg.senderType === 'AGENT' || lastMsg.from === 'me' ? 'You: ' : '') + (lastMsg.content || lastMsg.text)) : 'Waiting for student...'}
                      </span>
                      {unread > 0 && (
                        <span className="flex-shrink-0 min-w-[20px] h-[20px] px-1.5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            }) : (
              <div className="py-24 px-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mb-4 shadow-sm border border-line">
                  <Icon name="chat" size={28} className="text-muted" />
                </div>
                <div className="text-[16px] font-bold text-ink">No conversations</div>
                <div className="text-[14px] text-muted mt-1">Nothing matches your search.</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Thread View */}
        <div className={`flex-1 flex-col min-w-0 bg-white/40 ${!id ? 'hidden md:flex' : 'flex'} relative`}>
          {activeChat ? (
            (() => {
              const name = activeChat.student ? `${activeChat.student.firstName} ${activeChat.student.lastName}` : (activeChat.name || 'Student');
              const avatar = activeChat.student?.profileImage?.url || activeChat.avatar;
              const listingName = activeChat.item?.name || activeChat.listing || 'Listing';

              return (
                <div className="absolute inset-0 flex flex-col z-10 overflow-hidden">
                  {/* Header */}
                  <div className="flex-none flex items-center gap-3 px-4 md:px-6 py-3 bg-surface border-b border-line shadow-sm2 z-20">
                    <button onClick={() => navigate('/messages')} aria-label="Back"
                      className="md:hidden w-10 h-10 flex-shrink-0 rounded-full text-ink flex items-center justify-center hover:bg-bg transition-colors -ml-2 mr-1">
                      <Icon name="chevronLeft" size={24} />
                    </button>
                    <div className="relative flex-shrink-0 shadow-sm2 rounded-full">
                      <Avatar color="#0d7a72" name={name} url={avatar} size={44} />
                      {activeChat.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-ok border-[2.5px] border-surface shadow-sm2" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[16.5px] font-bold text-ink tracking-tight leading-tight truncate">{name}</div>
                      {/* <div className={`text-[12px] font-medium leading-tight mt-0.5 ${activeChat.online ? 'text-ok' : 'text-muted'}`}>
                        {activeChat.online ? 'Online now' : 'Offline'}
                      </div> */}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                      <Icon name="tag" size={14} color="#0d7a72" />
                      <span className="text-[13px] font-semibold text-primary-600 truncate max-w-[150px] lg:max-w-[200px]">{listingName}</span>
                    </div>
                    <button aria-label="Call" onClick={() => flash('Call feature coming soon')}
                      className="w-10 h-10 flex-shrink-0 rounded-full text-muted hover:text-ink hover:bg-bg flex items-center justify-center transition-colors ml-2 shadow-sm border border-line">
                      <Icon name="phone" size={18} />
                    </button>
                    <div className="relative" ref={menuRef}>
                      <button aria-label="More options" onClick={() => setMenuOpen(!menuOpen)}
                        className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors shadow-sm border border-line ${menuOpen ? 'bg-bg text-ink' : 'text-muted hover:text-ink hover:bg-bg'}`}>
                        <Icon name="moreVertical" size={18} />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface border border-line rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1.5 z-50">
                          <button onClick={() => { setMenuOpen(false); navigate(`/student/${activeChat.student?.id || activeChat.student?._id}`); }} className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-ink hover:bg-bg transition-colors">View Student</button>
                          <button onClick={() => { flash('Report user coming soon'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-ink hover:bg-bg transition-colors">Report</button>
                          <div className="h-[1px] bg-line my-1"></div>
                          <button onClick={() => { flash('Delete chat not implemented yet'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors">Delete Chat</button>
                          <button onClick={() => { setMenuOpen(false); navigate('/messages'); }} className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-ink hover:bg-bg transition-colors">Close Chat</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile listing strip */}
                  <div className="sm:hidden flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-surface/90 backdrop-blur-md border-b border-line shadow-sm2 z-10">
                    <Icon name="tag" size={12} color="#0d7a72" />
                    <span className="text-[12.5px] font-semibold text-primary-600 truncate">Re: {listingName}</span>
                  </div>

                  {/* Messages Area */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                    <div className="flex flex-col max-w-[800px] mx-auto">
                      {activeMessages.map((m, i) => {
                        const mDate = m.createdAt || m.when;
                        const prevM = activeMessages[i - 1];
                        const nextM = activeMessages[i + 1];
                        
                        const showDemarcation = i === 0 || !isSameDay(mDate, prevM?.createdAt || prevM?.when);
                        const nextDate = nextM?.createdAt || nextM?.when;
                        const isSameSenderAsNext = nextM && isMine(m) === isMine(nextM) && isSameDay(mDate, nextDate);
                        
                        return (
                          <div key={m._id || i} className="flex flex-col w-full">
                            {showDemarcation && (
                              <div className="text-center mb-5 mt-4 first:mt-2">
                                <span className="inline-block px-3 py-1 bg-surface border border-line rounded-full shadow-sm text-[11px] font-extrabold text-muted uppercase tracking-wider">
                                  {getDemarcation(mDate)}
                                </span>
                              </div>
                            )}
                            <div className={isSameSenderAsNext ? 'mb-1.5' : 'mb-3'}>
                              <Bubble m={m} showTime={!isSameSenderAsNext} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Grounded Input Console */}
                  <div className="flex-none bg-surface border-t border-line px-4 md:px-8 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(20,32,30,0.02)]">
                    <div className="flex items-end gap-3 max-w-[800px] mx-auto">
                      <button aria-label="Add photo"
                        className="w-12 h-12 flex-shrink-0 rounded-full text-muted hover:text-primary hover:bg-primary/5 flex items-center justify-center transition-all bg-bg shadow-sm border border-line cursor-pointer">
                        <Icon name="camera" size={22} />
                      </button>
                      <div className="flex-1 flex items-end bg-bg border border-line shadow-sm rounded-[24px] pl-5 pr-1.5 py-1.5 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                        <textarea
                          value={draft}
                          onChange={e => setDraft(e.target.value)}
                          rows={1}
                          disabled={!hasStudentMessage}
                          placeholder={hasStudentMessage ? "Type your message..." : "Waiting for student..."}
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                          className={`flex-1 resize-none border-none bg-transparent py-3 font-[inherit] text-[15.5px] leading-[1.4] max-h-32 text-ink outline-none font-medium ${!hasStudentMessage ? 'placeholder:text-faint cursor-not-allowed' : 'placeholder:text-muted'}`}
                        />
                        <button onClick={send} disabled={!draft.trim() || !hasStudentMessage}
                          className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 mb-0.5 ml-2 shadow-sm ${
                            draft.trim() && hasStudentMessage ? 'bg-primary cursor-pointer text-white hover:bg-primary-600' : 'bg-surface border border-line cursor-not-allowed text-faint'
                          }`}>
                          <Icon name="send" size={17} style={{ transform: 'translateX(-1px)' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-surface rounded-[0_24px_24px_0]">
              <div className="w-24 h-24 bg-bg rounded-full flex items-center justify-center mb-6 shadow-sm2 border border-line">
                <Icon name="chat" size={40} className="text-muted" />
              </div>
              <h2 className="text-[24px] font-extrabold text-ink mb-2 tracking-tight">Your Messages</h2>
              <p className="text-[15.5px] text-muted max-w-sm font-medium">
                Select a conversation from the list to start chatting with students.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
