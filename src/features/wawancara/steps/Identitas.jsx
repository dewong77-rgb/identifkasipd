import { useMemo, useState } from 'react';
import { Card } from '@/ui/PageHeader.jsx';
import { DateInput, NumInput, TextInput } from '@/ui/Field.jsx';
import Combobox from '@/ui/Combobox.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';

const Chip = ({ children, onRemove }) => (
  <span className="inline-flex min-h-9 items-center gap-1 rounded-full border border-navy bg-navy-50 py-1 pl-3 pr-1 text-sm font-semibold text-navy">
    {children}
    <button type="button" onClick={onRemove} aria-label={`Hapus ${children}`} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white">
      <Icon name="x" size={14} />
    </button>
  </span>
);

export default function Identitas() {
  const { boot } = useApp();
  const { session, updateForm, updateTarget } = useSession();
  const { target, form } = session;
  const [manual, setManual] = useState('');
  const manualSekolah = target.sumber_lokus === 'manual';
  const nama = (id) => boot.petugas.find((p) => p.petugas_id === id)?.nama || id;
  const opsi = useMemo(
    () =>
      boot.petugas
        .filter((p) => !form.pewawancara_ids.includes(p.petugas_id))
        .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
        .map((p) => ({ value: p.petugas_id, label: p.nama })),
    [boot.petugas, form.pewawancara_ids]
  );

  const setResp = (i, k, v) => updateForm((f) => ({ ...f, responden: f.responden.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="mb-3 font-bold text-navy">Sekolah</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {manualSekolah ? (
            <>
              <TextInput label="Nama sekolah" required value={target.nama_sekolah} onChange={(e) => updateTarget({ nama_sekolah: e.target.value })} />
              <NumInput label="NPSN" hint="Opsional." value={target.npsn} onChange={(v) => updateTarget({ npsn: v })} />
              <TextInput label="Kabupaten atau kota" required value={target.kab} onChange={(e) => updateTarget({ kab: e.target.value })} />
              <TextInput label="Provinsi" value={target.prov} onChange={(e) => updateTarget({ prov: e.target.value })} />
            </>
          ) : (
            <>
              <TextInput label="Nama sekolah" value={target.nama_sekolah} readOnly />
              <TextInput label="NPSN" value={target.npsn} readOnly />
              <TextInput label="Kabupaten atau kota" value={target.kab} readOnly />
              <TextInput label="Tim" value={target.tim_id} readOnly />
            </>
          )}
          <DateInput label="Tanggal pelaksanaan" required value={form.tanggal_pelaksanaan} onChange={(e) => updateForm({ tanggal_pelaksanaan: e.target.value })} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 font-bold text-navy">Pewawancara</h3>
        <p className="mb-3 text-sm text-muted">Pilih dari daftar petugas. Bila nama tidak ada, ketik secara manual.</p>
        <div className="mb-3 flex flex-wrap gap-2" aria-live="polite">
          {form.pewawancara_ids.map((id) => (
            <Chip key={id} onRemove={() => updateForm((f) => ({ ...f, pewawancara_ids: f.pewawancara_ids.filter((x) => x !== id) }))}>
              {nama(id)}
            </Chip>
          ))}
          {form.pewawancara_manual.map((n, i) => (
            <Chip key={`m${i}`} onRemove={() => updateForm((f) => ({ ...f, pewawancara_manual: f.pewawancara_manual.filter((_, j) => j !== i) }))}>
              {n}
            </Chip>
          ))}
          {form.pewawancara_ids.length + form.pewawancara_manual.length === 0 && <span className="text-sm text-muted">Belum ada pewawancara dipilih.</span>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Combobox
            label="Tambah dari daftar"
            options={opsi}
            value=""
            clearOnSelect
            onSelect={(id) => updateForm((f) => ({ ...f, pewawancara_ids: [...f.pewawancara_ids, id] }))}
            placeholder="Ketik nama petugas"
          />
          <div className="space-y-1.5">
            <TextInput label="Atau ketik nama lain" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Nama pewawancara" />
            <Button
              variant="secondary"
              disabled={!manual.trim()}
              onClick={() => {
                const n = manual.trim();
                updateForm((f) => ({ ...f, pewawancara_manual: [...f.pewawancara_manual, n] }));
                setManual('');
              }}
            >
              <Icon name="plus" size={16} />
              Tambah nama
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 font-bold text-navy">Responden</h3>
        <p className="mb-3 text-sm text-muted">Satu sampai tiga orang. Nama wajib, jabatan dianjurkan.</p>
        <div className="space-y-4">
          {form.responden.map((r, i) => (
            <div key={i} className="rounded-md border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-ink">Responden {i + 1}</p>
                {form.responden.length > 1 && (
                  <button type="button" className="min-h-11 px-2 text-sm font-semibold text-navy underline" onClick={() => updateForm((f) => ({ ...f, responden: f.responden.filter((_, j) => j !== i) }))}>
                    Hapus
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput label="Nama" required={i === 0} value={r.nama} onChange={(e) => setResp(i, 'nama', e.target.value)} />
                <TextInput label="Jabatan" placeholder="Kepala sekolah, operator, bendahara" value={r.jabatan} onChange={(e) => setResp(i, 'jabatan', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        {form.responden.length < 3 && (
          <Button variant="secondary" className="mt-3" onClick={() => updateForm((f) => ({ ...f, responden: [...f.responden, { nama: '', jabatan: '' }] }))}>
            <Icon name="plus" size={16} />
            Tambah responden
          </Button>
        )}
      </Card>
    </div>
  );
}
