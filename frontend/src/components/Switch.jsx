export default function Switch({ checked, onChange, id }) {
  return (
    <label htmlFor={id} className="relative inline-block w-[46px] h-7 flex-shrink-0 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="absolute opacity-0 w-full h-full m-0 cursor-pointer z-10"
      />
      <span
        className="absolute inset-0 rounded-full transition-colors duration-200"
        style={{ background: checked ? '#0d7a72' : '#d6dedc' }}
      />
      <span
        className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(18px)' : 'none' }}
      />
    </label>
  );
}
