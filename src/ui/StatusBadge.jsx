import Icon from './Icon.jsx';

const S = {
  belum: { icon: 'circle', cls: 'border-slate-300 bg-white text-muted' },
  draft: { icon: 'half', cls: 'border-gold bg-gold-50 text-ink' },
  selesai: { icon: 'check', cls: 'border-navy bg-navy text-white' },
};

export default function StatusBadge({ status }) {
  const m = S[status.key];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${m.cls}`}>
      <Icon name={m.icon} size={14} strokeWidth={2.5} />
      {status.label}
    </span>
  );
}
