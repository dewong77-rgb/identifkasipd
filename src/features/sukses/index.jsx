import { Navigate, useNavigate } from 'react-router-dom';
import { Card } from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { fmtDateTime, fmtNum } from '@/core/lib/format.js';

export default function Sukses() {
  const { session, reset } = useSession();
  const nav = useNavigate();
  const r = session.result;
  if (!r) return <Navigate to="/tinjau" replace />;
  return (
    <div className="mx-auto max-w-xl">
      <Card className="border-navy text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Icon name="check" size={30} strokeWidth={3} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-navy">Isian berhasil terkirim</h1>
        <div className="gold-rule mx-auto mt-2" />
        <p className="mt-3 text-sm text-ink">{session.target.nama_sekolah}</p>
        <dl className="mx-auto mt-4 max-w-sm divide-y divide-line text-left">
          <div className="flex justify-between py-2 text-sm">
            <dt className="text-muted">Nomor sesi</dt>
            <dd className="font-bold">{r.sesi_id}</dd>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <dt className="text-muted">Butir terisi</dt>
            <dd className="font-bold">{fmtNum(r.jml_butir_terisi)} dari 31</dd>
          </div>
          <div className="flex justify-between gap-3 py-2 text-sm">
            <dt className="text-muted">Waktu kirim</dt>
            <dd className="text-right font-bold">{fmtDateTime(r.diperbarui_pada)}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={() => {
              reset();
              nav('/');
            }}
          >
            Kembali ke daftar lokus
          </Button>
          <Button variant="secondary" onClick={() => nav('/wawancara')}>
            Ubah isian
          </Button>
        </div>
      </Card>
    </div>
  );
}
