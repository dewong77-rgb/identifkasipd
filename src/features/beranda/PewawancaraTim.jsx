import { useState } from 'react';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { TextInput } from '@/ui/Field.jsx';

// Centang pewawancara dari rekan satu tim, plus ketik nama lain bila perlu.
export default function PewawancaraTim({ rekan, ids, manual, onIds, onManual }) {
  const [teks, setTeks] = useState('');
  const toggle = (id) => onIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-ink">Pewawancara yang hadir</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {rekan.map((p) => {
          const on = ids.includes(p.petugas_id);
          return (
            <label key={p.petugas_id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-semibold ${on ? 'border-navy bg-navy text-white' : 'border-line bg-white hover:bg-navy-50'}`}>
              <input type="checkbox" checked={on} onChange={() => toggle(p.petugas_id)} className="h-5 w-5 accent-[#E8A020]" />
              {p.nama}
            </label>
          );
        })}
      </div>
      {manual.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {manual.map((n, i) => (
            <span key={i} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-navy bg-navy-50 py-1 pl-3 pr-1 text-sm font-semibold text-navy">
              {n}
              <button type="button" aria-label={`Hapus ${n}`} onClick={() => onManual(manual.filter((_, j) => j !== i))} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white">
                <Icon name="x" size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <TextInput label="Nama lain (bila tidak ada di daftar)" value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Ketik nama pewawancara" />
        </div>
        <Button
          variant="secondary"
          disabled={!teks.trim()}
          onClick={() => {
            onManual([...manual, teks.trim()]);
            setTeks('');
          }}
        >
          Tambah
        </Button>
      </div>
    </fieldset>
  );
}
