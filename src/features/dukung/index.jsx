import { Link, useNavigate } from 'react-router-dom';
import PageHeader, { Card } from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import ErrorPanel from '@/ui/ErrorPanel.jsx';
import Icon from '@/ui/Icon.jsx';
import { SkeletonList } from '@/ui/Skeleton.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { useDukung } from '@/core/hooks/useDukung.js';
import { fmtDateTime } from '@/core/lib/format.js';
import IdentitasCard from './IdentitasCard.jsx';
import TrendChart from './TrendChart.jsx';
import AngkaBesar from './AngkaBesar.jsx';
import QualityBars from './QualityBars.jsx';
import BahanPendalaman from './BahanPendalaman.jsx';

export default function DataDukung() {
  const { session, markDilihat } = useSession();
  const { target, form } = session;
  const nav = useNavigate();
  const { state, data, fromCache, error, retry } = useDukung(target);
  const tersedia = data?.tersedia === true;
  const dilihat = form.data_dukung_dilihat_pada;

  return (
    <>
      <PageHeader title="Data dukung sekolah" subtitle="Lihat data ini lebih dulu sebelum mengisi instrumen." />
      {state === 'loading' && <SkeletonList rows={4} />}
      {state === 'error' && <ErrorPanel title="Data dukung belum dapat dimuat" message={error} onRetry={retry} />}

      {state === 'ready' && (
        <div className="space-y-4">
          {fromCache && (
            <p role="status" className="flex items-start gap-2 rounded-md border border-gold bg-gold-50 p-3 text-sm">
              <Icon name="info" size={18} className="mt-0.5 shrink-0" />
              Data dari penyimpanan perangkat. Server belum dapat dijangkau.
            </p>
          )}
          {!tersedia ? (
            <>
              <IdentitasCard target={target} tanggal={form.tanggal_pelaksanaan} />
              <Card className="border-gold bg-gold-50">
                <p className="font-semibold text-ink">Data dukung tidak tersedia untuk sekolah ini.</p>
                <p className="mt-1 text-sm text-muted">Anda dapat langsung memulai wawancara.</p>
              </Card>
            </>
          ) : (
            <>
              <IdentitasCard sekolah={data.sekolah} target={target} tanggal={form.tanggal_pelaksanaan} />
              <AngkaBesar s={data.sekolah} />
              <TrendChart sekolah={data.sekolah} />
              <QualityBars s={data.sekolah} pembanding={data.pembanding} />
              <BahanPendalaman s={data.sekolah} pemicuB15={!!data.pemicu_b15} />
            </>
          )}

          <Card className="bg-navy-50">
            {tersedia && !dilihat && <p className="mb-3 text-sm text-ink">Tekan tombol di bawah setelah selesai melihat data dukung. Waktunya dicatat dan ikut terkirim.</p>}
            {tersedia && dilihat && (
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
                <Icon name="check" size={18} />
                Data dukung sudah dilihat pada {fmtDateTime(dilihat)}.
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              {tersedia && !dilihat && (
                <Button variant="gold" onClick={markDilihat}>
                  <Icon name="check" size={18} />
                  Saya sudah melihat data dukung
                </Button>
              )}
              <Button disabled={tersedia && !dilihat} onClick={() => nav('/wawancara')}>
                Mulai wawancara
                <Icon name="next" size={18} />
              </Button>
              <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-semibold text-muted hover:bg-white">
                Kembali ke daftar lokus
              </Link>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
