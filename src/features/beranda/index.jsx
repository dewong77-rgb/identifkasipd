import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BootGate from '@/app/BootGate.jsx';
import PageHeader from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { listDrafts } from '@/core/lib/draftStore.js';
import { fmtDateTime, fmtRange, toYmd } from '@/core/lib/format.js';
import PetugasPicker from './PetugasPicker.jsx';
import LokusCard from './LokusCard.jsx';
import MulaiDialog from './MulaiDialog.jsx';
import LokusLainDialog from './LokusLainDialog.jsx';
import { lokusToTarget, manualTarget, defaultTanggal } from './target.js';

function BerandaIsi() {
  const { boot, petugasId, setPetugasId, statusMap, statusState, refreshStatus } = useApp();
  const { beginFromDraft } = useSession();
  const nav = useNavigate();
  const [mulai, setMulai] = useState(null); // { target, tanggal, jadwal }
  const [lain, setLain] = useState(false);

  const milik = useMemo(() => {
    const ids = new Set(boot.petugas_lokus.filter((x) => x.petugas_id === petugasId).map((x) => x.lokus_id));
    return boot.lokus.filter((l) => ids.has(l.lokus_id));
  }, [boot, petugasId]);

  const grup = useMemo(() => {
    const m = new Map();
    [...milik]
      .sort((a, b) => String(a.tahap).localeCompare(String(b.tahap)) || toYmd(a.tgl_mulai).localeCompare(toYmd(b.tgl_mulai)) || a.nama_sekolah.localeCompare(b.nama_sekolah, 'id'))
      .forEach((l) => {
        const k = `${l.tahap}|${toYmd(l.tgl_mulai)}`;
        if (!m.has(k)) m.set(k, { tahap: l.tahap, label: l.label_waktu, mulai: l.tgl_mulai, selesai: l.tgl_selesai, items: [] });
        m.get(k).items.push(l);
      });
    return [...m.values()];
  }, [milik]);

  const drafManual = listDrafts().filter((d) => d.target?.sumber_lokus === 'manual');

  const bukaLokus = (l) => setMulai({ target: lokusToTarget(l), tanggalAwal: defaultTanggal(l), jadwal: fmtRange(l.tgl_mulai, l.tgl_selesai) });

  return (
    <>
      <PageHeader title="Pilih sekolah yang dikunjungi" subtitle="Alat bantu lapangan Direktorat SMA. Isi semua dulu, lalu kirim sekali di akhir." />

      <div className="max-w-md">
        <PetugasPicker petugas={boot.petugas} value={petugasId} onChange={setPetugasId} />
      </div>

      <div className="mt-6 space-y-6">
        {!petugasId && <p className="rounded-md border border-line bg-navy-50 p-3 text-sm">Pilih nama Anda untuk melihat lokus yang menjadi tugas Anda.</p>}
        {petugasId && grup.length === 0 && (
          <p className="rounded-md border border-line bg-navy-50 p-3 text-sm">Belum ada lokus untuk nama ini. Gunakan tombol di bawah untuk memilih atau menambah sekolah.</p>
        )}
        {grup.map((g) => (
          <section key={`${g.tahap}${g.mulai}`} aria-label={`Tahap ${g.tahap}`}>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
              Tahap {g.tahap}, {g.label || fmtRange(g.mulai, g.selesai)}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {g.items.map((l) => (
                <LokusCard key={l.lokus_id} lokus={l} entry={statusMap[String(l.npsn)]} onOpen={() => bukaLokus(l)} />
              ))}
            </div>
          </section>
        ))}

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
            setMulai({ target: manualTarget(f), tanggalAwal: f.tanggal });
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
