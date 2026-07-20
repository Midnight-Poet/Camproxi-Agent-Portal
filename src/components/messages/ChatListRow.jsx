import Avatar from '../Avatar';
import Icon from '../Icon';

export default function ChatListRow({ c, onClick }) {
  const last = c.messages[c.messages.length - 1];
  const preview = (last.from === 'me' ? 'You: ' : '') + last.text;
  return (
    <button onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 w-full text-left border-none bg-transparent cursor-pointer border-b border-white/40 font-[inherit] hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-200">
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
