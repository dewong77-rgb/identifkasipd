import { useId, useMemo, useState } from 'react';
import Icon from './Icon.jsx';

// Dropdown dengan pencarian. options: [{ value, label, sub? }]
export default function Combobox({ label, options, value, onSelect, placeholder = 'Ketik untuk mencari', emptyText = 'Tidak ada hasil.', clearOnSelect = false, hint }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const selected = options.find((o) => o.value === value);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (t ? options.filter((o) => `${o.label} ${o.sub || ''}`.toLowerCase().includes(t)) : options).slice(0, 80);
  }, [q, options]);

  const pick = (o) => {
    onSelect(o.value, o);
    setQ('');
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      <div className="relative">
        <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          autoComplete="off"
          value={open ? q : clearOnSelect ? q : selected?.label || ''}
          placeholder={selected && !clearOnSelect ? selected.label : placeholder}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          className="block min-h-11 w-full rounded-md border border-line bg-white py-2 pl-10 pr-3 text-base focus:border-navy"
        />
        {open && (
          <ul id={`${id}-list`} role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-line bg-white shadow-lg">
            {list.length === 0 && <li className="px-3 py-3 text-sm text-muted">{emptyText}</li>}
            {list.map((o) => (
              <li key={o.value} role="option" aria-selected={o.value === value}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o)}
                  className={`block min-h-11 w-full px-3 py-2 text-left text-sm hover:bg-navy-50 ${o.value === value ? 'bg-navy-50 font-semibold' : ''}`}
                >
                  <span className="block text-ink">{o.label}</span>
                  {o.sub && <span className="block text-xs text-muted">{o.sub}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
