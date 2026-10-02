import { useMemo, useState } from 'react';
import Dialog from '@/ui/Dialog.jsx';
import Button from '@/ui/Button.jsx';
import Combobox from '@/ui/Combobox.jsx';
import { DateInput, NumInput, TextInput } from '@/ui/Field.jsx';
import { fmtRange } from '@/core/lib/format.js';

export default function LokusLainDialog({ lokus, onPickLokus, onPickManual, onClose }) {
  const [tab, setTab] = useState('daftar');
  const [sel, setSel] = useState('');
  const [f, setF] = useState({ nama: '', npsn: '', kab: '', prov: '', tanggal: '' });
  const [tried, setTried] = useState(false);
  const options = useMemo(
    () => lokus.map((l) => ({ value: l.lokus_id, label: l.nama_sekolah, sub: `${l.kab}, Tahap ${l.tahap}, ${fmtRange(l.tgl_mulai, l.tgl_selesai)}` })),
    [lokus]
  );
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target ? e.target.value : e }));
  const err = {
    nama: !f.nama.trim() && 'Nama sekolah wajib diisi.',
    kab: !f.kab.trim() && 'Kabupaten atau kota wajib diisi.',
    tanggal: !f.tanggal && 'Tanggal pelaksanaan wajib dipilih.',
  };
  const submitManual = () => {
    setTried(true);
    if (err.nama || err.kab || err.tanggal) return;
    onPickManual(f);
  };

  const tabCls = (t) => `min-h-11 flex-1 border-b-2 px-3 text-sm font-semibold ${tab === t ? 'border-gold text-navy' : 'border-transparent text-muted'}`;
  return (
    <Dialog title="Lokus saya tidak ada di sini" onClose={onClose}>
      <div role="tablist" className="mb-4 flex border-b border-line">
        <button role="tab" aria-selected={tab === 'daftar'} className={tabCls('daftar')} onClick={() => setTab('daftar')}>
          Pilih dari 72 lokus
        </button>
        <button role="tab" aria-selected={tab === 'manual'} className={tabCls('manual')} onClick={() => setTab('manual')}>
          Tambah sekolah
        </button>
      </div>

      {tab === 'daftar' ? (
        <div className="space-y-4">
          <Combobox label="Cari sekolah" options={options} value={sel} onSelect={setSel} placeholder="Ketik nama sekolah" />
          <Button disabled={!sel} onClick={() => onPickLokus(lokus.find((l) => l.lokus_id === sel))}>
            Pilih sekolah ini
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <TextInput label="Nama sekolah" required value={f.nama} onChange={set('nama')} error={tried && err.nama} />
          <NumInput label="NPSN" hint="Opsional." value={f.npsn} onChange={(v) => setF((x) => ({ ...x, npsn: v }))} />
          <TextInput label="Kabupaten atau kota" required value={f.kab} onChange={set('kab')} error={tried && err.kab} />
          <TextInput label="Provinsi" hint="Opsional." value={f.prov} onChange={set('prov')} />
          <DateInput label="Tanggal pelaksanaan" required value={f.tanggal} onChange={set('tanggal')} error={tried && err.tanggal} />
          <p className="text-sm text-muted">Data dukung tidak tersedia untuk sekolah tambahan.</p>
          <Button onClick={submitManual}>Lanjut</Button>
        </div>
      )}
    </Dialog>
  );
}
