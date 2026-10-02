import { Link } from 'react-router-dom';
import BootGate from '@/app/BootGate.jsx';
import PageHeader from '@/ui/PageHeader.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { useDukung } from '@/core/hooks/useDukung.js';
import { isB15Hidden } from '@/core/hooks/useB15.js';
import { validateAll } from '@/core/validate/index.js';
import { RingkasanButir, RingkasanIdentitas, RingkasanStatus } from './Ringkasan.jsx';
import DaftarMasalah from './DaftarMasalah.jsx';
import KirimPanel from './KirimPanel.jsx';
import { useSubmit } from './useSubmit.js';

function Isi() {
  const { boot } = useApp();
  const { session } = useSession();
  const { data } = useDukung(session.target);
  const { form, target } = session;
  const b15Hidden = isB15Hidden(data, form.status_ringkasan.s2_pd_dapodik);
  const ctx = { form, target, butir: boot.instrumen.butir, b15Hidden, dukung: data };
  const sub = useSubmit(ctx);
  const live = validateAll(ctx);
  const issues = sub.clientIssues.length ? live : [];

  return (
    <>
      <PageHeader title="Tinjau dan kirim" subtitle="Periksa ringkasan, lalu kirim sekali. Isian yang sudah terkirim tetap bisa diubah dan dikirim ulang." />
      <div className="space-y-4">
        <DaftarMasalah issues={issues} />
        {!issues.length && live.length > 0 && (
          <p className="rounded-md border border-line bg-navy-50 p-3 text-sm">
            Masih ada {live.length} hal yang perlu dilengkapi sebelum bisa dikirim. Tekan Kirim untuk melihat daftarnya.
          </p>
        )}
        <RingkasanIdentitas form={form} target={target} petugas={boot.petugas} />
        <RingkasanStatus form={form} />
        <RingkasanButir form={form} butir={boot.instrumen.butir} b15Hidden={b15Hidden} />
        <KirimPanel state={sub.state} err={sub.err} onKirim={sub.kirim} onMuat={sub.muatYangAda} loadingExisting={sub.loadingExisting} butir={boot.instrumen.butir} />
        <Link to="/wawancara" className="inline-flex min-h-11 items-center text-sm font-semibold text-navy underline">
          Kembali ke wawancara
        </Link>
      </div>
    </>
  );
}

export default function Tinjau() {
  return (
    <BootGate>
      <Isi />
    </BootGate>
  );
}
