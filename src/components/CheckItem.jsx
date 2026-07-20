import Icon from './Icon';

export default function CheckItem({ label, checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-on={checked}
      className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-md2 border-[1.5px] text-sm font-semibold transition-all duration-150 ${
        checked
          ? 'border-primary/45 bg-primary-50 text-primary-700'
          : 'border-line bg-white text-camtext'
      }`}
    >
      <span className={`w-5 h-5 rounded-[6px] flex-shrink-0 flex items-center justify-center transition-all duration-150 border-[1.5px] ${
        checked ? 'bg-primary border-primary' : 'bg-white border-faint'
      }`}>
        {checked && <Icon name="check" size={13} color="#fff" stroke={3} />}
      </span>
      {label}
    </button>
  );
}
