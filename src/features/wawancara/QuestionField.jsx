import { useEffect, useRef } from 'react';
import { Card } from '@/ui/PageHeader.jsx';
import { TextArea } from '@/ui/Field.jsx';
import Icon from '@/ui/Icon.jsx';
import { kodeButir, nomorButir } from '@/core/lib/instrumen.js';

export default function QuestionField({ butir, value, onChange, hidden = false, focus = false }) {
  const kode = kodeButir(butir);
  const ref = useRef(null);
  const kosong = !String(value ?? '').trim();

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      const ta = ref.current.querySelector('textarea');
      if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 350);
    }
  }, [focus]);

  return (
    <div ref={ref} id={`butir-${kode}`}>
      <Card className={hidden ? 'bg-slate-50' : ''}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 rounded bg-navy px-2 py-0.5 text-xs font-bold text-white">{nomorButir(butir)}</span>
          <p className="min-w-0 flex-1 font-semibold leading-snug text-ink">{butir.pertanyaan}</p>
          {!hidden && kosong && <span className="shrink-0 rounded-full border border-gold bg-gold-50 px-2 py-0.5 text-xs font-semibold">Kosong</span>}
          {!hidden && !kosong && <Icon name="check" size={18} className="shrink-0 text-navy" />}
        </div>
        {hidden ? (
          <p className="mt-3 rounded-md border border-line bg-white p-3 text-sm text-ink">Tidak ditanyakan, tidak ada selisih. Butir ini akan dikirim sebagai "tidak ditanyakan".</p>
        ) : (
          <div className="mt-3 space-y-3">
            <TextArea label="Kesimpulan jawaban" value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={4} />
            {butir.pendalaman?.length > 0 && (
              <details className="rounded-md border border-line bg-navy-50">
                <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 text-sm font-semibold text-navy">
                  <Icon name="chev" size={16} />
                  Pendalaman informasi ({butir.pendalaman.length})
                </summary>
                <ul className="list-disc space-y-1.5 px-8 pb-3 pt-1 text-sm text-ink">
                  {butir.pendalaman.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
