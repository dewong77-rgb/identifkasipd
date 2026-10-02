import Icon from '@/ui/Icon.jsx';

export default function ProgressSteps({ steps, current, done, onGo }) {
  return (
    <nav aria-label="Langkah wawancara" className="-mx-4 mb-5 overflow-x-auto px-4">
      <ol className="flex min-w-max gap-1.5 border-b border-line pb-0">
        {steps.map((s, i) => {
          const aktif = s.id === current;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onGo(s.id)}
                aria-current={aktif ? 'step' : undefined}
                className={`flex min-h-11 items-center gap-1.5 border-b-[3px] px-3 text-sm font-semibold ${aktif ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy'}`}
              >
                <Icon name={done[s.id] ? 'check' : 'circle'} size={15} strokeWidth={2.5} />
                <span className="text-xs">{i + 1}.</span> {s.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
