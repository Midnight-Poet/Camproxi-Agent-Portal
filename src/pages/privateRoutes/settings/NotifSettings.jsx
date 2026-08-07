import { useNavigate } from 'react-router-dom';
import AppBar from '../../../components/AppBar';
import Layout from '../../../components/Layout';
import Icon from '../../../components/Icon';
import { useApp } from '../../../context/AppContext';

function SettingToggle({ label, desc, active, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/[0.02] transition-colors" onClick={onToggle}>
      <div className="flex-1 pr-4">
        <div className="font-semibold text-ink text-[14.5px]">{label}</div>
        <div className="text-muted text-[13px] leading-snug mt-0.5">{desc}</div>
      </div>
      <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-300 ${active ? 'bg-primary' : 'bg-line'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

export default function NotifSettings() {
  const navigate = useNavigate();
  const { flash } = useApp();

  const handleToggle = () => {
    flash('Settings will be saved automatically');
  }

  return (
    <Layout>
      <div className="flex flex-col h-full bg-bg">
        <AppBar title="Notifications" onBack={() => navigate('/profile')} />
        <div className="flex-1 overflow-y-auto mt-2 px-4 pb-8">
          <div className="max-w-xl mx-auto w-full">
            <div className="text-[11px] font-extrabold tracking-widest uppercase text-primary mb-3 mt-4 ml-1">
              Push Notifications
            </div>
            <div className="bg-white rounded-card border border-line shadow-sm overflow-hidden mb-6">
              <SettingToggle 
                label="New Requests" 
                desc="Get notified when a student requests an item" 
                active={true}
                onToggle={handleToggle}
              />
              <div className="h-px bg-line mx-4" />
              <SettingToggle 
                label="Chat Messages" 
                desc="Alerts for new student messages" 
                active={true}
                onToggle={handleToggle}
              />
              <div className="h-px bg-line mx-4" />
              <SettingToggle 
                label="Reviews & Ratings" 
                desc="When someone leaves a review on your item" 
                active={true}
                onToggle={handleToggle}
              />
            </div>

            <div className="text-[11px] font-extrabold tracking-widest uppercase text-primary mb-3 mt-4 ml-1">
              Email Notifications
            </div>
            <div className="bg-white rounded-card border border-line shadow-sm overflow-hidden">
              <SettingToggle 
                label="Weekly Summary" 
                desc="A digest of your activity and performance" 
                active={false}
                onToggle={handleToggle}
              />
              <div className="h-px bg-line mx-4" />
              <SettingToggle 
                label="Product Updates" 
                desc="News about Camproxi features and changes" 
                active={true}
                onToggle={handleToggle}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
