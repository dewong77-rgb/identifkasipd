import { Card } from '@/ui/PageHeader.jsx';
import { fmtNum, fmtSigned } from '@/core/lib/format.js';

const n = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

const Item = ({ butir, children }) => (
  <li className="flex gap-3 py-2.5">
    <span className="mt-0.5 h-fit shrink-0 rounded bg-navy px-2 py-0.5 text-xs font-bold text-white">{butir}</span>
    <span className="text-sm text-ink">{children}</span>
  </li>
);

export default function BahanPendalaman({ s, pemicuB15 }) {
  const selBos = n(s.selisih_bos) ?? (n(s.pd_bos_2027) !== null && n(s.pd_bos_2026) !== null ? n(s.pd_bos_2027) - n(s.pd_bos_2026) : null);
  return (
    <Card aria-label="Bahan pendalaman" className="border-gold">
      <h2 className="text-base font-bold text-navy">Bahan pendalaman</h2>
      <p className="text-sm text-muted">Angka berikut dapat dipakai sebagai pembuka pertanyaan pada butir terkait.</p>
      <ul className="mt-2 divide-y divide-line">
        <Item butir="B10, B13">
          Selisih BOSP: <strong>{fmtSigned(selBos)}</strong>. Peserta Didik BOSP 2026: <strong>{fmtNum(s.pd_bos_2026)}</strong>.
        </Item>
        <Item butir="B15">{pemicuB15 ? 'Ada selisih Dapodik dengan Peserta Didik BOSP 2027, tanyakan butir 15.' : 'Tidak ada selisih, lanjut ke butir 16.'}</Item>
        <Item butir="B18">
          Residu NISN: <strong>{fmtNum(s.residu_nisn)}</strong>. Residu NIK: <strong>{fmtNum(s.residu_nik)}</strong>.
        </Item>
      </ul>
    </Card>
  );
}
