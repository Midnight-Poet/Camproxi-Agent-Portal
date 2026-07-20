import Switch from '../Switch';
import Icon from '../Icon';

export default function NotifToggle({ icon, label, sub, on, onChange, last }) {
  return (
    <div className={`flex items-center gap-3.5 px-[15px] py-3.5 ${last ? '' : 'border-b border-line2'}`}>
      <div className="w-9 h-9 rounded-[10px] flex-shrink-0 bg-primary-50 text-primary-700 flex items-center justify-center">
        <Icon name={icon} size={19} color="#084f49" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[14.5px] text-ink">{label}</div>
        {sub && <div className="text-muted text-[12.5px] mt-0.5">{sub}</div>}
      </div>
      <Switch checked={on} onChange={onChange} id={'nt-' + label} />
    </div>
  );
}
