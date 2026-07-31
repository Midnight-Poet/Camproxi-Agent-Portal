import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/Icon';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import { useApp } from '../../../context/AppContext';
import { 
  useGetMeQuery, 
  useSendEmailVerificationMutation, 
  useVerifyEmailMutation,
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation 
} from '../../../redux/api/agentApiSlice';

export default function Verification() {
  const navigate = useNavigate();
  const { flash } = useApp();
  const { data: agentData, isLoading } = useGetMeQuery();
  
  const [sendEmail, { isLoading: isSendingEmail }] = useSendEmailVerificationMutation();
  const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation();
  const [sendPhone, { isLoading: isSendingPhone }] = useSendPhoneVerificationMutation();
  const [verifyPhone, { isLoading: isVerifyingPhone }] = useVerifyPhoneMutation();

  const [modalState, setModalState] = useState({ isOpen: false, type: null }); // type: 'email' | 'phone'
  const [otp, setOtp] = useState('');

  const agent = agentData?.agent || {};
  const emailVerified = agent.emailVerified || false;
  const phoneVerified = agent.phoneVerified || false;
  const isVerified = agent.isverified || false;

  const checks = [
    { label: 'Identity', sub: 'Government ID confirmed', done: agent.identityVerified || false },
    { label: 'Business', sub: 'CAC certificate confirmed', done: agent.businessVerified || false },
    { label: 'Email', sub: 'Email address confirmed', done: emailVerified, action: 'email' },
    { label: 'Phone', sub: 'Phone number confirmed', done: phoneVerified, action: 'phone' },
    { label: 'Address', sub: 'Proof of campus-area address', done: agent.addressVerified || false },
  ];

  const handleVerifyClick = async (type) => {
    try {
      if (type === 'email') await sendEmail().unwrap();
      if (type === 'phone') await sendPhone().unwrap();
      setModalState({ isOpen: true, type });
      setOtp('');
      flash(`OTP sent to your ${type}!`);
    } catch (err) {
      flash(err?.data?.message || `Failed to send ${type} verification`, true);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) return flash('OTP must be 6 digits', true);
    
    try {
      if (modalState.type === 'email') await verifyEmail({ otp }).unwrap();
      if (modalState.type === 'phone') await verifyPhone({ otp }).unwrap();
      
      setModalState({ isOpen: false, type: null });
      flash(`${modalState.type === 'email' ? 'Email' : 'Phone'} verified successfully!`);
    } catch (err) {
      flash(err?.data?.message || 'Invalid OTP', true);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col h-full bg-transparent">
          <AppBar title="Verification" onBack={() => navigate('/profile')} />
          <div className="flex-1 flex justify-center items-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full bg-transparent relative">
        <AppBar title="Verification" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-[18px] pb-7 pt-4">
            {/* Status banner */}
            <div className={`glass-heavy rounded-[24px] border ${isVerified ? 'border-ok/30' : 'border-warn/30'} shadow-sm p-6 text-center mb-5 relative overflow-hidden transition-all duration-500`}>
              <div className={`absolute inset-0 bg-gradient-to-b ${isVerified ? 'from-ok/10' : 'from-warn/10'} to-transparent pointer-events-none transition-all duration-500`} />
              <div className={`w-16 h-16 rounded-[20px] mx-auto mb-4 bg-gradient-to-br ${isVerified ? 'from-ok to-[#168558]' : 'from-warn to-[#a36915]'} flex items-center justify-center relative z-10 shadow-[0_4px_12px_rgba(31,157,107,0.3)] transition-all duration-500`}>
                <Icon name={isVerified ? "shield" : "clock"} size={32} color="#fff" />
              </div>
              <div className="font-extrabold text-[20px] text-ink relative z-10 transition-colors">
                {isVerified ? "You're verified" : "Verification Pending"}
              </div>
              <div className="text-muted text-[13.5px] mt-1 relative z-10 transition-colors">
                {isVerified ? 'Your agent account is fully verified' : 'Complete the missing checks below'}
              </div>
            </div>

            <div className="text-[12px] font-extrabold tracking-[0.09em] uppercase text-primary mb-3">What's verified</div>
            <div className="glass-heavy rounded-[24px] border border-white/60 shadow-sm overflow-hidden mb-5">
              {checks.map((c, i) => (
                <div key={c.label} className={`flex items-center gap-4 px-5 py-4 ${i < checks.length - 1 ? 'border-b border-white/40' : ''}`}>
                  <div className={`w-[38px] h-[38px] rounded-full flex-shrink-0 flex items-center justify-center shadow-sm transition-colors duration-500 ${c.done ? 'bg-gradient-to-br from-ok to-[#168558] text-white' : 'bg-gradient-to-br from-warn to-[#a36915] text-white'}`}>
                    <Icon name={c.done ? 'check' : 'clock'} size={20} stroke={2.4} color="#fff" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[14.5px] text-ink">{c.label}</div>
                    <div className="text-muted text-[12.5px]">{c.sub}</div>
                  </div>
                  {!c.done && c.action ? (
                    <button 
                      onClick={() => handleVerifyClick(c.action)}
                      disabled={isSendingEmail || isSendingPhone}
                      className="px-4 py-1.5 bg-ink text-white font-bold text-[12px] rounded-full shadow-sm hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSendingEmail || isSendingPhone ? 'Sending...' : 'Verify'}
                    </button>
                  ) : (
                    <span className={`text-[12px] font-extrabold transition-colors duration-500 ${c.done ? 'text-ok' : 'text-warn'}`}>
                      {c.done ? 'Done' : 'Pending'}
                    </span>
                  )}
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
              <button onClick={() => flash('Document replacement not implemented')}
                className="px-4 py-2 text-[13.5px] font-bold text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[12px] cursor-pointer hover:bg-white transition-all">Replace</button>
            </div>

            <button onClick={() => flash('Address proof upload not implemented')}
              className="w-full flex items-center justify-center gap-2 py-4 font-bold text-ink bg-white/60 backdrop-blur-sm border-[1.5px] border-black/10 rounded-[16px] cursor-pointer hover:bg-white transition-all shadow-sm">
              <Icon name="upload" size={18} /> Upload address proof
            </button>
          </div>
        </div>

        {/* OTP Modal */}
        {modalState.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#f0f0f5] w-full max-w-sm rounded-[24px] shadow-2xl p-6 relative border border-white animate-scaleUp">
              <button 
                onClick={() => setModalState({ isOpen: false, type: null })}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-ink hover:bg-gray-50"
              >
                <Icon name="x" size={16} stroke={2.5} />
              </button>
              
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Icon name={modalState.type === 'email' ? 'mail' : 'phone'} size={24} />
              </div>
              
              <h3 className="font-extrabold text-[20px] text-ink mb-2">
                Verify {modalState.type === 'email' ? 'Email' : 'Phone'}
              </h3>
              <p className="text-muted text-[14px] mb-6">
                We've sent a 6-digit code to your {modalState.type}. Please enter it below.
              </p>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-white border border-line rounded-xl px-4 py-3.5 text-ink font-bold text-[16px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-center tracking-[0.2em] mb-4"
              />

              <button
                onClick={handleOTPSubmit}
                disabled={isVerifyingEmail || isVerifyingPhone || otp.length !== 6}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:shadow-none"
              >
                {isVerifyingEmail || isVerifyingPhone ? 'Verifying...' : 'Submit Code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
