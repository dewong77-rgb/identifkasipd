import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BootGate from '@/app/BootGate.jsx';
import PageHeader, { Card } from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { SelectInput } from '@/ui/Field.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { listDrafts } from '@/core/lib/draftStore.js';
import { fmtDateTime, fmtRange } from '@/core/lib/format.js';
import { lsGet, lsSet } from '@/core/lib/storage.js';
import LokusCard from './LokusCard.jsx';
import MulaiDialog from './MulaiDialog.jsx';
import LokusLainDialog from './LokusLainDialog.jsx';
import TitikLokusPicker from './TitikLokusPicker.jsx';
import PewawancaraTim from './PewawancaraTim.jsx';
import PilihTim from './PilihTim.jsx';
import { useTitikLokus } from './useTitikLokus.js';
import { lokusToTarget, manualTarget, defaultTanggal } from './target.js';

const Langkah = ({ no, judul, children }) => (
  <section aria-label={judul} className="space-y-3">
    <h2 className="flex items-center gap-2 text-base font-bold text-navy">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-sm text-white">{no}</span>
      {judul}
    </h2>
    {children}
  </section>
);

function BerandaIsi() {
  const { boot, petugasId, setPetugasId, statusMap, statusState, refreshStatus } = useApp();
  const { beginFromDraft } = useSession();
  const nav = useNavigate();
  const { groups, provinsiDi, kabDi, timDi } = useTitikLokus(boot, statusMap);
  const [titikKey, setTitikKey] = useState(() => lsGet('ipd:titik', ''));
  const [prov, setProv] = useState('');
  const [kab, setKab] = useState('');
  const [timId, setTimId] = useState('');
  const [ids, setIds] = useState([]);
  const [manual, setManual] = useState([]);
  const [mulai, setMulai] = useState(null);
  const [lain, setLain] = useState(false);

  const titik = groups.find((g) => g.key === titikKey) || null;
  const daftarProv = useMemo(() => (titik ? provinsiDi(titik) : []), [titik, provinsiDi]);
  const provAktif = daftarProv.includes(prov) ? prov : daftarProv.length === 1 ? daftarProv[0] : '';
  const daftarKab = useMemo(() => (titik && provAktif ? kabDi(titik, provAktif) : []), [titik, provAktif, kabDi]);
  const kabAktif = daftarKab.some((k) => k.kab === kab) ? kab : daftarKab.length === 1 ? daftarKab[0].kab : '';
  const daftarTim = useMemo(() => (titik && provAktif && kabAktif ? timDi(titik, provAktif, kabAktif) : []), [titik, provAktif, kabAktif, timDi]);
  // Bila hanya satu tim, atau tim petugas yang tersimpan ada di sini, terpilih otomatis.
  const timOtomatis = daftarTim.length === 1 ? daftarTim[0].id : daftarTim.find((t) => t.petugas.some((p) => p.petugas_id === petugasId))?.id || '';
  const timAktif = daftarTim.find((t) => t.id === timId) || daftarTim.find((t) => t.id === timOtomatis) || null;
  const sasaran = timAktif ? timAktif.sekolah : [];
  const rekan = timAktif ? timAktif.petugas : [];
  const lokasiKey = `${titikKey}|${provAktif}|${kabAktif}|${timAktif?.id || ''}`;

  const pilihTitik = (k) => {
    setTitikKey(k);
    setProv('');
    setKab('');
    setTimId('');
    lsSet('ipd:titik', k);
  };

  // Pewawancara awal: petugas yang tersimpan di perangkat bila bertugas di titik lokus ini.
  useEffect(() => {
    setIds(rekan.some((p) => p.petugas_id === petugasId) ? [petugasId] : []);
    setManual([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lokasiKey]);

  const ubahIds = (v) => {
    setIds(v);
    if (v.length) setPetugasId(v[0]);
  };

  const drafManual = listDrafts().filter((d) => d.target?.sumber_lokus === 'manual');
  const awal = { pewawancara_ids: ids, pewawancara_manual: manual };
  const bukaLokus = (l) => setMulai({ target: lokusToTarget(l), tanggalAwal: defaultTanggal(l), jadwal: fmtRange(l.tgl_mulai, l.tgl_selesai), awal });

  return (
    <>
      <PageHeader title="Pilih sekolah sasaran" subtitle="Pilih tahap, titik lokus (provinsi dan kabupaten atau kota), tim, nama petugas, lalu sekolah yang dikunjungi. Isi semua dulu, kirim sekali di akhir." />

      <Link to="/panduan" className="mb-5 flex min-h-11 items-center justify-between gap-3 rounded-lg border border-gold bg-gold-50 px-4 py-2 text-sm hover:brightness-95">
        <span>
          <strong className="text-navy">Pertama kali memakai alat ini?</strong> Baca panduan penggunaan dulu.
        </span>
        <Icon name="next" size={16} className="shrink-0 text-navy" />
      </Link>

      <div className="space-y-7">
        <Langkah no="1" judul="Pilih tahap pelaksanaan">
          <TitikLokusPicker groups={groups} value={titikKey} onChange={pilihTitik} />
        </Langkah>

          {titik && (
          <Langkah no="2" judul="Pilih titik lokus">
            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <SelectInput label="Provinsi" value={provAktif} onChange={(v) => { setProv(v); setKab(''); setTimId(''); }} placeholder="Pilih provinsi" options={daftarProv} />
              <SelectInput
                label="Kabupaten atau kota"
                value={kabAktif}
                onChange={(v) => { setKab(v); setTimId(''); }}
                placeholder={provAktif ? 'Pilih kabupaten atau kota' : 'Pilih provinsi dulu'}
                disabled={!provAktif}
                options={daftarKab.map((k) => ({ value: k.kab, label: `${k.kab} (${k.n} sekolah)` }))}
              />
            </div>
          </Langkah>
        )}

        {daftarTim.length > 0 && (
          <Langkah no="3" judul="Pilih tim">
            <PilihTim tims={daftarTim} value={timAktif?.id || ''} onChange={setTimId} />
          </Langkah>
        )}

        {sasaran.length > 0 && (
          <>
            <Langkah no="4" judul="Pilih nama petugas">
              <Card>
                <p className="text-sm text-muted">Tanggal kegiatan</p>
                <p className="font-bold text-ink">{fmtRange(titik.tgl, titik.selesaiTgl)}</p>
                <div className="mt-4">
                  <PewawancaraTim rekan={rekan} ids={ids} manual={manual} onIds={ubahIds} onManual={setManual} />
                </div>
              </Card>
            </Langkah>

            <Langkah no="5" judul="Pilih sekolah sasaran">
              <div className="grid gap-3 md:grid-cols-2">
                {sasaran.map((l) => (
                  <LokusCard key={l.lokus_id} lokus={l} entry={statusMap[String(l.npsn)]} onOpen={() => bukaLokus(l)} />
                ))}
              </div>
            </Langkah>
          </>
        )}

        {drafManual.length > 0 && (
          <section aria-label="Draf sekolah tambahan">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Draf sekolah tambahan di perangkat ini</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {drafManual.map((d) => (
                <button
                  key={d.target.key}
                  type="button"
                  className="min-h-11 rounded-lg border border-line bg-white p-4 text-left hover:border-navy hover:bg-navy-50"
                  onClick={() => {
                    beginFromDraft(d);
                    nav('/wawancara');
                  }}
                >
                  <span className="block font-bold">{d.target.nama_sekolah}</span>
                  <span className="block text-sm text-muted">
                    {d.target.kab}. Disimpan {fmtDateTime(d.savedAt)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button variant="secondary" onClick={() => setLain(true)}>
            <Icon name="plus" size={18} />
            Lokus saya tidak ada di sini
          </Button>
          <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-navy hover:bg-navy-50">
            <Icon name="chart" size={18} />
            Lihat dashboard progres
          </Link>
          <Button variant="ghost" onClick={refreshStatus} loading={statusState.loading}>
            <Icon name="refresh" size={16} />
            Perbarui status
          </Button>
        </div>
        {statusState.error && <p className="text-sm text-muted">Status isian belum dapat diperbarui: {statusState.error}</p>}
      </div>

      {mulai && <MulaiDialog {...mulai} onClose={() => setMulai(null)} />}
      {lain && (
        <LokusLainDialog
          lokus={boot.lokus}
          onClose={() => setLain(false)}
          onPickLokus={(l) => {
            setLain(false);
            bukaLokus(l);
          }}
          onPickManual={(f) => {
            setLain(false);
            setMulai({ target: manualTarget(f), tanggalAwal: f.tanggal, awal });
          }}
        />
      )}
    </>
  );
}

export default function Beranda() {
  return (
    <BootGate>
      <BerandaIsi />
    </BootGate>
  );
}
