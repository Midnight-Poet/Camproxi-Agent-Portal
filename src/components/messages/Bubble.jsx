export default function Bubble({ m }) {
  const mine = m.from === 'me';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[74%] md:max-w-[64%]">
        <div className={`px-[14px] py-[10px] text-[14.5px] leading-[1.45] ${
          mine
            ? 'bg-gradient-to-br from-primary to-primary-600 text-white rounded-[18px_18px_5px_18px] shadow-sm'
            : 'glass border border-white/60 text-ink rounded-[18px_18px_18px_5px] shadow-sm'
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
