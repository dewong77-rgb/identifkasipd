import { Link } from 'react-router-dom';
import Button from '@/ui/Button.jsx';
import ErrorPanel from '@/ui/ErrorPanel.jsx';
import Icon from '@/ui/Icon.jsx';
import { guessStepFromMessage } from '@/core/validate/index.js';

const stepHref = (msg, butir) => {
  const g = guessStepFromMessage(msg);
  if (g.step === 'dukung') return '/dukung';
  if (g.step === 'butir') {
    const b = butir.find((x) => parseInt(String(x.no_butir).replace(/\D+/g, ''), 10) === g.butirNo);
    const k = `B${String(g.butirNo).padStart(2, '0')}`;
    return b ? `/wawancara?step=bagian-${b.kode_bagian}&q=${k}&cek=1` : '/wawancara';
  }
  return `/wawancara?step=${g.step}&cek=1`;
};

export default function KirimPanel({ state, err, onKirim, onMuat, loadingExisting, butir }) {
  return (
    <div className="space-y-3">
      {state === 'error' && err?.code === 'SESI_ADA' && (
        <ErrorPanel title="Sekolah ini sudah punya isian" message="Isian lain sudah tersimpan di server untuk sekolah ini. Isian Anda di layar ini belum terkirim dan tetap aman di perangkat.">
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button onClick={onMuat} loading={loadingExisting}>
              Muat isian yang sudah ada untuk diubah
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">Memuat isian yang ada akan mengganti isian di layar ini dengan isi dari server.</p>
        </ErrorPanel>
      )}

      {state === 'error' && err?.code === 'VALIDASI' && (
        <ErrorPanel title="Server menolak isian" message={err.message} detail={err.detail}>
          {Array.isArray(err.detail) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {err.detail.map((d, i) => (
                <Link key={i} to={stepHref(d, butir)} className="inline-flex min-h-11 items-center rounded-md border border-navy bg-white px-3 text-sm font-semibold text-navy hover:bg-gold-50">
                  Periksa: {String(d).slice(0, 36)}
                </Link>
              ))}
            </div>
          )}
          <Button className="mt-3" onClick={onKirim}>
            Kirim ulang
          </Button>
        </ErrorPanel>
      )}

      {state === 'error' && err && err.code !== 'SESI_ADA' && err.code !== 'VALIDASI' && (
        <ErrorPanel title="Isian belum terkirim" message={`${err.message} Isian Anda tetap utuh di perangkat ini.`} detail={err.detail} onRetry={onKirim} retryLabel="Kirim ulang" />
      )}

      <Button variant="gold" className="w-full sm:w-auto" onClick={onKirim} loading={state === 'sending'} disabled={state === 'sending'}>
        {state === 'sending' ? (
          'Mengirim...'
        ) : (
          <>
            <Icon name="send" size={18} />
            Kirim
          </>
        )}
      </Button>
      {state === 'sending' && <p className="text-sm text-muted">Mohon tunggu, jangan tutup halaman. Batas waktu 30 detik.</p>}
    </div>
  );
}
