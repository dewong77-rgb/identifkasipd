import { Card } from '@/ui/PageHeader.jsx';
import { ChoiceInput, DateInput, NumInput, TextInput } from '@/ui/Field.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { useDukung } from '@/core/hooks/useDukung.js';
import { PILIHAN_S5, PILIHAN_S8, hitungS4 } from '@/core/lib/statusSchema.js';
import { fmtNum, fmtSigned } from '@/core/lib/format.js';

const DEFAULT_LABEL = {
  S1: 'Tanggal sinkronisasi Dapodik terakhir',
  S2: 'Jumlah peserta didik di Dapodik',
  S3: 'Jumlah peserta didik riil',
  S4: 'Selisih Dapodik dan riil',
  S5: 'Residu peserta didik',
  S6: 'Jumlah peserta didik pada SK Pagu 2026',
  S7: 'Pengecekan data terakhir',
  S8: 'Bukti pendukung',
};

function Acuan({ dukung }) {
  if (!dukung || dukung.tersedia !== true) return null;
  const s = dukung.sekolah;
  const rows = [
    ['Peserta Didik Dapodik terbaru', fmtNum(s.pd_dapo_update)],
    ['Peserta Didik BOSP 2026', fmtNum(s.pd_bos_2026)],
    ['Peserta Didik BOSP 2027', fmtNum(s.pd_bos_2027)],
    ['Selisih Dapodik dan BOSP 2027', fmtSigned(s.selisih_dapo_vs_bos2027)],
    ['Residu NISN', fmtNum(s.residu_nisn)],
    ['Residu NIK', fmtNum(s.residu_nik)],
  ];
  return (
    <Card className="border-gold bg-gold-50 lg:sticky lg:top-4">
      <h3 className="font-bold text-navy">Acuan data Dapodik</h3>
      <p className="mb-2 text-xs text-muted">Sebagai pembanding. Tidak mengisi otomatis.</p>
      <dl className="space-y-1.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-muted">{k}</dt>
            <dd className="font-bold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export default function Status() {
  const { boot } = useApp();
  const { session, setStatusField } = useSession();
  const { data } = useDukung(session.target);
  const st = session.form.status_ringkasan;
  const label = (kode) => {
    const x = boot.instrumen?.status?.find((i) => i.kode === kode);
    return `${kode}. ${x?.butir_status || DEFAULT_LABEL[kode]}`;
  };
  const s4 = hitungS4(st);
  const set = (k) => (v) => setStatusField(k, v);
  const ev = (k) => (e) => setStatusField(k, e.target.value);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_17rem]">
      <div className="order-2 space-y-4 lg:order-1">
        <Card>
          <DateInput label={label('S1')} required value={st.s1_sinkron_terakhir} onChange={ev('s1_sinkron_terakhir')} />
        </Card>
        <Card className="grid gap-4 sm:grid-cols-2">
          <NumInput label={label('S2')} required value={st.s2_pd_dapodik} onChange={set('s2_pd_dapodik')} />
          <NumInput label={label('S3')} required value={st.s3_pd_riil} onChange={set('s3_pd_riil')} />
          <div className="sm:col-span-2 rounded-md border border-line bg-navy-50 p-3">
            <p className="text-sm font-semibold text-ink">{label('S4')}</p>
            <p className="text-2xl font-bold text-navy">{s4 === null ? '-' : fmtSigned(s4)}</p>
            <p className="text-xs text-muted">Dihitung otomatis (S2 dikurangi S3). Tidak perlu diisi.</p>
          </div>
        </Card>
        <Card className="space-y-4">
          <ChoiceInput label={label('S5')} required name="s5" options={PILIHAN_S5} value={st.s5_residu_ada} onChange={set('s5_residu_ada')} />
          {st.s5_residu_ada === 'Ada' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumInput label="Jumlah residu" required value={st.s5_residu_jumlah} onChange={set('s5_residu_jumlah')} />
              <TextInput label="Jenis residu" placeholder="Contoh: NISN, NIK" value={st.s5_residu_jenis} onChange={ev('s5_residu_jenis')} />
            </div>
          )}
        </Card>
        <Card>
          <NumInput label={label('S6')} hint="Opsional." value={st.s6_pd_sk_pagu_2026} onChange={set('s6_pd_sk_pagu_2026')} />
        </Card>
        <Card className="grid gap-4 sm:grid-cols-2">
          <p className="text-sm font-semibold text-ink sm:col-span-2">{label('S7')}</p>
          <DateInput label="Tanggal" value={st.s7_cek_terakhir_tanggal} onChange={ev('s7_cek_terakhir_tanggal')} />
          <TextInput label="Dilakukan oleh" value={st.s7_cek_terakhir_oleh} onChange={ev('s7_cek_terakhir_oleh')} />
        </Card>
        <Card>
          <ChoiceInput label={label('S8')} required name="s8" options={PILIHAN_S8} value={st.s8_bukti_ada} onChange={set('s8_bukti_ada')} />
        </Card>
      </div>
      <div className="order-1 lg:order-2">
        <Acuan dukung={data} />
      </div>
    </div>
  );
}
