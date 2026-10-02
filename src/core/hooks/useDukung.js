import { useCallback, useEffect, useState } from 'react';
import { getDukung } from '../api/endpoints.js';
import { lsGet, lsSet } from '../lib/storage.js';

const mem = new Map();

// Sekolah manual tidak punya data dukung, jadi tidak memanggil server.
export function useDukung(target) {
  const npsn = target?.sumber_lokus === 'master' ? String(target.npsn || '') : '';
  const [st, setSt] = useState(() => {
    if (!target) return { state: 'idle', data: null, fromCache: false, error: null };
    if (!npsn) return { state: 'ready', data: { tersedia: false }, fromCache: false, error: null };
    if (mem.has(npsn)) return { state: 'ready', data: mem.get(npsn), fromCache: false, error: null };
    return { state: 'loading', data: null, fromCache: false, error: null };
  });

  const load = useCallback(async () => {
    if (!npsn) return;
    setSt((s) => ({ ...s, state: s.data ? s.state : 'loading', error: null }));
    try {
      const data = await getDukung(npsn);
      mem.set(npsn, data);
      lsSet(`ipd:dukung:${npsn}`, data);
      setSt({ state: 'ready', data, fromCache: false, error: null });
    } catch (e) {
      const cached = lsGet(`ipd:dukung:${npsn}`, null);
      if (cached) setSt({ state: 'ready', data: cached, fromCache: true, error: e.message });
      else setSt({ state: 'error', data: null, fromCache: false, error: e.message });
    }
  }, [npsn]);

  useEffect(() => {
    if (!target) return;
    if (!npsn) {
      setSt({ state: 'ready', data: { tersedia: false }, fromCache: false, error: null });
      return;
    }
    if (mem.has(npsn)) {
      setSt({ state: 'ready', data: mem.get(npsn), fromCache: false, error: null });
      return;
    }
    load();
  }, [npsn, target, load]);

  return { ...st, retry: load };
}
