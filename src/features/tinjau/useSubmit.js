import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSesi, submitSesi } from '@/core/api/endpoints.js';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { buildPayload } from '@/core/lib/payload.js';
import { validateAll } from '@/core/validate/index.js';

// Alur kirim: validasi klien, kirim, tangani hasil. "Berhasil" hanya bila ok:true dari server.
export function useSubmit(ctx) {
  const nav = useNavigate();
  const { refreshStatus } = useApp();
  const { session, finishSubmit, beginFromServer } = useSession();
  const [state, setState] = useState('idle'); // idle | sending | error
  const [err, setErr] = useState(null); // { code, message, detail, sesi_id }
  const [clientIssues, setClientIssues] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const kirim = async () => {
    const issues = validateAll(ctx);
    setClientIssues(issues);
    setErr(null);
    if (issues.length) {
      setState('idle');
      return;
    }
    setState('sending');
    try {
      const res = await submitSesi(buildPayload(ctx));
      finishSubmit({
        sesi_id: res.sesi_id,
        status_isian: res.status_isian,
        jml_butir_terisi: res.jml_butir_terisi,
        diperbarui_pada: res.diperbarui_pada,
        baru: res.baru,
      });
      refreshStatus();
      nav('/sukses');
    } catch (e) {
      setState('error');
      setErr({ code: e.code, message: e.message, detail: e.detail, sesi_id: e.extra?.sesi_id });
    }
  };

  const muatYangAda = async () => {
    setLoadingExisting(true);
    try {
      const d = await getSesi(err?.sesi_id ? { sesi_id: err.sesi_id } : { npsn: session.target.npsn });
      if (!d?.ada) throw new Error('Isian di server tidak ditemukan.');
      beginFromServer(session.target, d.sesi, session.form.tanggal_pelaksanaan);
      nav('/wawancara');
    } catch (e) {
      setErr((x) => ({ ...x, message: `Gagal memuat isian yang ada. ${e.message}` }));
    } finally {
      setLoadingExisting(false);
    }
  };

  return { state, err, clientIssues, kirim, muatYangAda, loadingExisting };
}
