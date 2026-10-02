import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BootGate from '@/app/BootGate.jsx';
import PageHeader, { Card } from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import Combobox from '@/ui/Combobox.jsx';
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
  const { groups, petugasDi, timDari } = useTitikLokus(boot, statusMap);
  const [titikKey, setTitikKey] = useState(() => lsGet('ipd:titik', ''));
  const [ids, setIds] = useState([]);
  const [manual, setManual] = useState([]);
  const [mulai, setMulai] = useState(null);
  const [lain, setLain] = useState(false);

  const titik = groups.find((g) => g.key === titikKey) || null;
  const daftarPetugas = useMemo(() => (titik ? petugasDi(titik) : []), [titik, petugasDi]);
  const petugasAda = daftarPetugas.some((p) => p.petugas_id === petugasId);
  const tim = titik && petugasAda ? timDari(titik, petugasId) : null;

  const pilihTitik = (k) => {
    setTitikKey(k);
    lsSet('ipd:titik', k);
  };

  // Pewawancara awal: petugas yang dipilih. Rekan dicentang manual oleh petugas.
  useEffect(() => {
    setIds(petugasAda ? [petugasId] : []);
    setManual([]);
  }, [petugasId, titikKey, petugasAda]);

  const opsiPetugas = daftarPetugas.map((p) => ({ value: p.petugas_id, label: p.nama }));
  const drafManual = listDrafts().filter((d) => d.target?.sumber_lokus === 'manual');
  const awal = { pewawancara_ids: ids, pewawancara_manual: manual };
  const bukaLokus = (l) => setMulai({ target: lokusToTarget(l), tanggalAwal: defaultTanggal(l), jadwal: fmtRange(l.tgl_mulai, l.tgl_selesai), awal });

  return (
    <>
      <PageHeader title="Pilih sekolah sasaran" subtitle="Pilih titik lokus, nama petugas, lalu sekolah yang dikunjungi. Isi semua dulu, kirim sekali di akhir." />

      <div className="space-y-7">
        <Langkah no="1" judul="Pilih titik lokus">
          <TitikLokusPicker groups={groups} value={titikKey} onChange={pilihTitik} />
        </Langkah>

        {titik && (
          <Langkah no="2" judul="Pilih nama petugas">
            <div className="max-w-md">
              <Combobox label="Nama petugas" hint={`Petugas pada Tahap ${titik.tahap}, ${fmtRange(titik.tgl, titik.selesaiTgl)}. Pilihan diingat di perangkat ini.`} options={opsiPetugas} value={petugasAda ? petugasId : ''} onSelect={setPetugasId} placeholder="Ketik nama Anda" />
            </div>
            {petugasId && !petugasAda && <p className="rounded-md border border-line bg-navy-50 p-3 text-sm">Nama yang tersimpan tidak bertugas pada titik lokus ini. Pilih nama lain, atau gunakan tombol "Lokus saya tidak ada di sini".</p>}
          </Langkah>
        )}

        {tim && (
          <>
            <Langkah no="3" judul="Tim dan jadwal">
              <Card>
                <p className="text-sm text-muted">Tanggal kegiatan</p>
                <p className="font-bold text-ink">{fmtRange(titik.tgl, titik.selesaiTgl)}</p>
                <div className="mt-4">
                  <PewawancaraTim rekan={tim.rekan} ids={ids} manual={manual} onIds={setIds} onManual={setManual} />
                </div>
              </Card>
            </Langkah>

            <Langkah no="4" judul="Pilih sekolah sasaran">
              {tim.sasaran.length === 0 && <p className="rounded-md border border-line bg-navy-50 p-3 text-sm">Belum ada sekolah sasaran untuk nama ini pada titik lokus ini.</p>}
              <div className="grid gap-3 md:grid-cols-2">
                {tim.sasaran.map((l) => (
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
