import Icon from '../Icon';

export default function Bubble({ m, showTime = true }) {
  const mine = m.senderType === 'AGENT' || m.senderModel === 'AGENT' || m.from === 'me';
  const text = m.content || m.text;
  const when = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : m.when;

  return (
    <div className={`flex w-full animate-fadeUp ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%] md:max-w-[70%] relative group">
        <div className={`px-4 py-2.5 text-[15px] leading-[1.45] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
          mine
            ? 'bg-primary text-white rounded-[18px_18px_4px_18px]'
            : 'bg-white border border-[#e8ebeb] text-ink rounded-[18px_18px_18px_4px]'
        }`}>
          {text}
        </div>
        
        {/* Subtle timestamp that appears on hover or below */}
        {showTime && (
          <div className={`text-[10.5px] font-bold mt-1 tracking-wide flex items-center gap-1 ${mine ? 'justify-end text-muted' : 'justify-start text-muted'}`}>
            <span>{when}</span>
            {mine && (
              <span className={`flex items-center justify-center ${m.isRead ? 'text-primary' : 'text-[#c0c5c5]'}`}>
                <Icon name="checkCheck" size={14} color="currentColor" stroke={2.5} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
