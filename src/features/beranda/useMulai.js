import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSesi } from '@/core/api/endpoints.js';
import { useSession } from '@/core/context/SessionContext.jsx';
import { loadDraft, targetKey } from '@/core/lib/draftStore.js';

// Logika memulai atau melanjutkan sesi dari dialog Beranda.
export function useMulai(target, tanggal, awal) {
  const nav = useNavigate();
  const { beginNew, beginFromServer } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const key = target.key || targetKey(target);
  const draft = loadDraft(key);

  const mulaiBaru = () => {
    beginNew(target, tanggal, awal);
    const dilihat = draft?.form?.data_dukung_dilihat_pada;
    nav(dilihat ? '/wawancara' : '/dukung');
  };

  const lanjutServer = async () => {
    setBusy(true);
    setError('');
    try {
      const d = await getSesi({ npsn: target.npsn });
      if (!d || !d.ada) {
        setError('Isian di server tidak ditemukan. Mulai sebagai isian baru.');
        return;
      }
      beginFromServer(target, d.sesi, tanggal);
      nav(d.sesi?.meta?.data_dukung_dilihat_pada || target.sumber_lokus === 'manual' ? '/wawancara' : '/dukung');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return { draft, busy, error, mulaiBaru, lanjutServer };
}
