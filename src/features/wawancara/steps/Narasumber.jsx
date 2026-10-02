import { Card } from '@/ui/PageHeader.jsx';
import { TextInput } from '@/ui/Field.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';

// Pilihan narasumber sesuai instrumen. Server menerima paling banyak 3 responden.
const PERAN = ['Kepala sekolah', 'Operator Dapodik', 'Bendahara', 'Pengelola data'];
const MAKS = 3;

export default function Narasumber() {
  const { session, updateForm } = useSession();
  const rows = session.form.responden;
  const penuh = rows.length >= MAKS;
  const setRow = (i, patch) => updateForm((f) => ({ ...f, responden: f.responden.map((r, j) => (j === i ? { ...r, ...patch } : r)) }));
  const hapus = (i) => updateForm((f) => ({ ...f, responden: f.responden.filter((_, j) => j !== i) }));
  const tambah = (jabatan) => updateForm((f) => ({ ...f, responden: [...f.responden, { nama: '', jabatan }] }));
  const idxPeran = (p) => rows.findIndex((r) => r.jabatan === p);

  return (
    <Card>
      <h3 className="mb-1 font-bold text-navy">Narasumber</h3>
      <p className="mb-3 text-sm text-muted">Pilih siapa saja yang diwawancarai. Boleh lebih dari satu, paling banyak {MAKS} orang.</p>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Pilih peran narasumber">
        {PERAN.map((p) => {
          const i = idxPeran(p);
          const on = i >= 0;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              disabled={!on && penuh}
              onClick={() => (on ? hapus(i) : tambah(p))}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:bg-navy-50'}`}
            >
              {on && <Icon name="check" size={16} strokeWidth={3} />}
              {p}
            </button>
          );
        })}
        <Button variant="secondary" disabled={penuh} onClick={() => tambah('')}>
          <Icon name="plus" size={16} />
          Peran lain
        </Button>
      </div>

      {rows.length === 0 && <p className="rounded-md border border-line bg-navy-50 p-3 text-sm">Belum ada narasumber dipilih.</p>}
      <div className="space-y-3">
        {rows.map((r, i) => {
          const baku = PERAN.includes(r.jabatan);
          return (
            <div key={i} className="rounded-md border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-ink">{baku ? r.jabatan : `Narasumber ${i + 1}`}</p>
                <button type="button" className="min-h-11 px-2 text-sm font-semibold text-navy underline" onClick={() => hapus(i)}>
                  Hapus
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput label="Nama" required value={r.nama} onChange={(e) => setRow(i, { nama: e.target.value })} />
                {!baku && <TextInput label="Jabatan" value={r.jabatan} onChange={(e) => setRow(i, { jabatan: e.target.value })} placeholder="Contoh: Wakil kepala sekolah" />}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
