export default function Bubble({ m, showTime = true }) {
  const mine = m.senderType === 'AGENT' || m.from === 'me';
  const text = m.content || m.text;
  const when = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : m.when;

  return (
    <div className={`flex w-full animate-fadeUp ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%] md:max-w-[70%]">
        <div className={`px-4 md:px-5 py-3 text-[15.5px] leading-relaxed font-medium ${
          mine
            ? 'bg-primary text-white rounded-[24px_24px_6px_24px] shadow-sm2'
            : 'bg-surface border border-line text-ink rounded-[24px_24px_24px_6px] shadow-sm2'
        }`}>
          {text}
        </div>
        {showTime && (
          <div className={`text-[11.5px] font-bold mt-1.5 px-2 tracking-wide flex items-center gap-1 ${mine ? 'justify-end text-muted' : 'justify-start text-muted'}`}>
            <span>{when}</span>
            {mine && (
              <span className={`text-[14px] leading-none mb-[2px] ${m.isRead ? 'text-primary' : 'text-faint'}`}>
                ✓✓
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
