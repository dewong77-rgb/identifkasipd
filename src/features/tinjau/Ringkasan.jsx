import { Card } from '@/ui/PageHeader.jsx';
import { fmtDate, fmtNum, fmtSigned } from '@/core/lib/format.js';
import { hitungS4 } from '@/core/lib/statusSchema.js';
import { groupBagian, kodeButir, nomorButir, isButir15 } from '@/core/lib/instrumen.js';
import { Link } from 'react-router-dom';

const Row = ({ k, v }) => (
  <div className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:gap-3">
    <dt className="w-52 shrink-0 text-sm text-muted">{k}</dt>
    <dd className="min-w-0 break-words text-sm font-semibold text-ink">{v || '-'}</dd>
  </div>
);

const Edit = ({ step }) => (
  <Link to={`/wawancara?step=${step}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-navy underline">
    Ubah
  </Link>
);

export function RingkasanIdentitas({ form, target, petugas }) {
  const nama = (id) => petugas.find((p) => p.petugas_id === id)?.nama || id;
  const pw = [...form.pewawancara_ids.map(nama), ...form.pewawancara_manual].join(', ');
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-navy">Identitas dan narasumber</h2>
        <Edit step="identitas" />
      </div>
      <dl className="divide-y divide-line">
        <Row k="Sekolah" v={`${target.nama_sekolah}${target.npsn ? ` (NPSN ${target.npsn})` : ''}`} />
        <Row k="Kabupaten atau kota" v={target.kab} />
        <Row k="Tanggal pelaksanaan" v={fmtDate(form.tanggal_pelaksanaan)} />
        <Row k="Pewawancara" v={pw} />
        <Row k="Narasumber" v={form.responden.filter((r) => r.nama.trim()).map((r) => `${r.nama}${r.jabatan ? ` (${r.jabatan})` : ''}`).join('; ')} />
      </dl>
    </Card>
  );
}

export function RingkasanStatus({ form }) {
  const s = form.status_ringkasan;
  const s4 = hitungS4(s);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-navy">Ringkasan status</h2>
        <Edit step="status" />
      </div>
      <dl className="divide-y divide-line">
        <Row k="S1. Sinkron terakhir" v={s.s1_sinkron_terakhir && fmtDate(s.s1_sinkron_terakhir)} />
        <Row k="S2. Peserta didik Dapodik" v={s.s2_pd_dapodik !== '' ? fmtNum(s.s2_pd_dapodik) : ''} />
        <Row k="S3. Peserta didik riil" v={s.s3_pd_riil !== '' ? fmtNum(s.s3_pd_riil) : ''} />
        <Row k="S4. Selisih (otomatis)" v={s4 === null ? '' : fmtSigned(s4)} />
        <Row k="S5. Residu" v={s.s5_residu_ada === 'Ada' ? `Ada, ${fmtNum(s.s5_residu_jumlah)} (${s.s5_residu_jenis || 'jenis belum diisi'})` : s.s5_residu_ada} />
        <Row k="S6. Peserta didik SK Pagu 2026" v={s.s6_pd_sk_pagu_2026 !== '' ? fmtNum(s.s6_pd_sk_pagu_2026) : 'Tidak diisi'} />
        <Row k="S7. Cek terakhir" v={[s.s7_cek_terakhir_tanggal && fmtDate(s.s7_cek_terakhir_tanggal), s.s7_cek_terakhir_oleh].filter(Boolean).join(', ')} />
        <Row k="S8. Bukti" v={s.s8_bukti_ada} />
      </dl>
    </Card>
  );
}

export function RingkasanButir({ form, butir, b15Hidden }) {
  return (
    <Card>
      <h2 className="mb-2 font-bold text-navy">Jawaban butir</h2>
      <div className="space-y-2">
        {groupBagian(butir).map((g) => (
          <details key={g.kode} className="rounded-md border border-line">
            <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 px-3 text-sm font-semibold">
              <span>
                Bagian {g.kode}: {g.nama}
              </span>
            </summary>
            <ol className="divide-y divide-line border-t border-line">
              {g.items.map((b) => {
                const v = isButir15(b) && b15Hidden ? 'tidak ditanyakan' : form.jawaban[kodeButir(b)];
                return (
                  <li key={kodeButir(b)} className="px-3 py-2 text-sm">
                    <p className="text-muted">
                      {nomorButir(b)}. {b.pertanyaan}
                    </p>
                    <p className={`mt-0.5 whitespace-pre-wrap break-words ${String(v ?? '').trim() ? 'font-semibold text-ink' : 'text-muted'}`}>{String(v ?? '').trim() || 'Belum diisi'}</p>
                  </li>
                );
              })}
            </ol>
          </details>
        ))}
      </div>
    </Card>
  );
}
