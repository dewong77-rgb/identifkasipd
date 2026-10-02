import { Card } from '@/ui/PageHeader.jsx';
import { fmtNum, fmtSigned } from '@/core/lib/format.js';
import { nomorButir } from '@/core/lib/instrumen.js';

const n = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

// Bahan dari data dukung yang relevan untuk butir tertentu (B10, B13, B15, B18).
function DariDukung({ no, dukung }) {
  if (!dukung || dukung.tersedia !== true) return null;
  const s = dukung.sekolah;
  const selBos = n(s.selisih_bos) ?? (n(s.pd_bos_2027) !== null && n(s.pd_bos_2026) !== null ? n(s.pd_bos_2027) - n(s.pd_bos_2026) : null);
  let isi = null;
  if (no === 10 || no === 13) {
    isi = (
      <>
        Selisih BOSP: <strong>{fmtSigned(selBos)}</strong>. Peserta Didik BOSP 2026: <strong>{fmtNum(s.pd_bos_2026)}</strong>.
      </>
    );
  } else if (no === 15) {
    isi = dukung.pemicu_b15 ? 'Ada selisih Dapodik dengan Peserta Didik BOSP 2027, tanyakan butir 15.' : 'Tidak ada selisih, lanjut ke butir 16.';
  } else if (no === 18) {
    isi = (
      <>
        Residu NISN: <strong>{fmtNum(s.residu_nisn)}</strong>. Residu NIK: <strong>{fmtNum(s.residu_nik)}</strong>.
      </>
    );
  }
  if (!isi) return null;
  return (
    <Card className="border-gold bg-gold-50">
      <h3 className="text-sm font-bold text-navy">Dari data dukung</h3>
      <p className="mt-1 text-sm text-ink">{isi}</p>
    </Card>
  );
}

export default function BahanWawancara({ butir, dukung }) {
  const no = nomorButir(butir);
  return (
    <aside aria-label="Bahan wawancara" className="space-y-3">
      <DariDukung no={no} dukung={dukung} />
      <Card className="bg-navy-50">
        <h3 className="font-bold text-navy">Bahan wawancara</h3>
        <p className="text-xs text-muted">Pendalaman informasi untuk butir ini.</p>
        {butir.pendalaman?.length ? (
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-ink">
            {butir.pendalaman.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">Tidak ada bahan pendalaman untuk butir ini.</p>
        )}
      </Card>
    </aside>
  );
}
