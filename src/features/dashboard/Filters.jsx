import { SelectInput, TextInput } from '@/ui/Field.jsx';
import Button from '@/ui/Button.jsx';

export const SORTS = [
  { value: 'tahap', label: 'Tahap' },
  { value: 'tgl', label: 'Tanggal' },
  { value: 'kab', label: 'Kabupaten atau kota' },
  { value: 'nama', label: 'Nama sekolah' },
  { value: 'tim', label: 'Tim' },
  { value: 'status', label: 'Status' },
  { value: 'terisi', label: 'Butir terisi' },
  { value: 'diperbarui', label: 'Tanggal submit' },
];

export default function Filters({ f, set, tahapList, kabList, onReset }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <TextInput label="Cari nama atau NPSN" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Ketik untuk mencari" />
      <SelectInput label="Tahap" value={f.tahap} onChange={(v) => set({ tahap: v })} placeholder="Semua tahap" options={tahapList.map((t) => ({ value: t, label: `Tahap ${t}` }))} />
      <SelectInput label="Kabupaten atau kota" value={f.kab} onChange={(v) => set({ kab: v })} placeholder="Semua" options={kabList} />
      <SelectInput label="Status" value={f.status} onChange={(v) => set({ status: v })} placeholder="Semua status" options={[{ value: 'belum', label: 'Belum diisi' }, { value: 'draft', label: 'Draft' }, { value: 'selesai', label: 'Selesai' }]} />
      <SelectInput label="Urutkan" value={f.sort} onChange={(v) => set({ sort: v || 'tahap' })} placeholder="Tahap" options={SORTS} />
      <div className="flex items-end gap-2">
        <Button variant="secondary" onClick={() => set({ dir: f.dir === 'asc' ? 'desc' : 'asc' })} aria-label="Ubah arah urutan">
          {f.dir === 'asc' ? 'Naik' : 'Turun'}
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Atur ulang
        </Button>
      </div>
    </div>
  );
}
