import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Avatar from '../../components/Avatar';
import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';
import RequestCard from '../../components/requests/RequestCard';
import { useGetStudentProfileQuery } from '../../redux/api/agentApiSlice';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, requests, openChatThread, actRequest } = useApp();
  const { data: apiResponse, isLoading, error } = useGetStudentProfileQuery(id);
  
  const student = apiResponse?.data || apiResponse || null;

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !student) {
    return (
      <Layout>
        <div className="w-full h-full flex flex-col items-center justify-center text-muted">
          <Icon name="user" size={48} className="mb-4 opacity-50" />
          <p className="font-bold text-ink text-lg">Student not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-bg border border-line rounded-xl font-semibold hover:bg-surface transition-colors">Go Back</button>
        </div>
      </Layout>
    );
  }

  const name = student ? `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student' : 'Student';
  const avatar = student?.profileImage?.url || null;
  const campusText = student?.campusName || student?.campus?.name || (typeof student?.campus === 'string' ? student.campus : null) || student?.school?.name || student?.school?.code || 'No campus specified';

  const studentChats = chats.filter(c => (c.student?.id || c.student?._id) === id);
  const studentRequests = requests.filter(r => (r.studentId === id || (r.student?.id || r.student?._id) === id));

  const handleMessage = (chatId) => {
    openChatThread(chatId);
    navigate(`/messages/${chatId}`);
  };

  return (
    <Layout>
      <div className="w-full h-full overflow-y-auto py-6 px-4 md:px-8 lg:px-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-ink transition-colors mb-6 font-medium">
          <Icon name="chevronLeft" size={20} />
          Back
        </button>

        <div className="bg-surface border border-line rounded-card shadow-sm overflow-hidden">
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="p-1.5 bg-surface rounded-full shadow-sm border border-line">
                <Avatar name={name} url={avatar} size={88} color="#0d7a72" />
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[24px] font-bold text-ink tracking-tight">{name}</h1>
                  {student?.isVerified && (
                    <span className="flex-shrink-0 text-primary" title="Verified Student">
                      <Icon name="shield" size={18} color="#0d7a72" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[15px] font-medium text-muted">Student</p>
                  <span className="w-1 h-1 rounded-full bg-line"></span>
                  <div className="flex items-center gap-1 text-[13px] font-semibold text-muted">
                    <Icon name="pin" size={13} />
                    {campusText}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-line"></span>
                  {student?.isVerified ? (
                    <span className="text-[12px] font-bold text-ok bg-ok-bg px-2 py-0.5 rounded-full">Verified</span>
                  ) : (
                    <span className="text-[12px] font-bold text-muted bg-bg px-2 py-0.5 rounded-full border border-line">Unverified</span>
                  )}
                </div>
                
                <p className="mt-4 text-[14.5px] text-camtext leading-relaxed max-w-xl">
                  {student?.bio || "This student hasn't added a bio yet."}
                </p>
              </div>
              {studentChats.length > 0 && (
                <button 
                  onClick={() => handleMessage(studentChats[0].id || studentChats[0]._id)}
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[14.5px] hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-2 w-fit"
                >
                  <Icon name="chat" size={18} />
                  Message
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-surface border border-line rounded-[20px] p-6 shadow-sm">
            <h2 className="text-[17px] font-bold text-ink mb-4 flex items-center gap-2">
              <Icon name="requests" size={18} className="text-primary" />
              Recent Requests
            </h2>
            {studentRequests.length > 0 ? (
              <div className="space-y-4">
                {studentRequests.map((req, i) => (
                  <RequestCard key={req.id || i} r={req} onAct={actRequest} hideAvatar={true} />
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-muted font-medium">No requests from this student.</p>
            )}
          </div>

          <div className="bg-surface border border-line rounded-[20px] p-6 shadow-sm">
            <h2 className="text-[17px] font-bold text-ink mb-4 flex items-center gap-2">
              <Icon name="chat" size={18} className="text-primary" />
              Conversations
            </h2>
            {studentChats.length > 0 ? (
              <div className="space-y-3">
                {studentChats.map(c => {
                  const validMsgs = (c.messages || []).filter(m => !(m.content || m.text || '').toLowerCase().includes('started a conversation'));
                  const lastMsg = validMsgs.length > 0 ? validMsgs[validMsgs.length - 1] : (c.lastMessage?.content?.toLowerCase().includes('started a conversation') ? null : c.lastMessage);
                  
                  return (
                    <button 
                      key={c.id || c._id} 
                      onClick={() => handleMessage(c.id || c._id)}
                      className="w-full text-left p-3 rounded-[12px] hover:bg-bg transition-colors border border-transparent hover:border-line flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-4">
                        <div className="text-[14.5px] font-semibold text-ink mb-0.5 truncate">{c.item?.name || c.listing || 'General Chat'}</div>
                        <div className="text-[13px] text-muted font-medium truncate">
                          {lastMsg ? (((lastMsg.senderType === 'AGENT' || lastMsg.senderModel === 'AGENT' || lastMsg.from === 'me') ? 'You: ' : '') + (lastMsg.content || lastMsg.text)) : 'Waiting for student...'}
                        </div>
                      </div>
                      <Icon name="chevronRight" size={16} className="text-muted group-hover:text-ink transition-colors flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[14px] text-muted font-medium">No active conversations.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
