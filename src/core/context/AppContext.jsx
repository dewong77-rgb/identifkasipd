import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getBootstrap, getStatus } from '../api/endpoints.js';
import { lsGet, lsSet } from '../lib/storage.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const K_BOOT = 'ipd:boot';
const K_STATUS = 'ipd:status';
const K_PETUGAS = 'ipd:petugas';

export function AppProvider({ children }) {
  const [boot, setBoot] = useState(null);
  const [bootState, setBootState] = useState({ loading: true, error: null, fromCache: false });
  const [statusMap, setStatusMap] = useState({});
  const [statusState, setStatusState] = useState({ loading: false, error: null, fromCache: false, at: null });
  const [petugasId, setPetugasIdState] = useState(() => lsGet(K_PETUGAS, ''));
  const bootRef = useRef(null);

  const refreshStatus = useCallback(async () => {
    setStatusState((s) => ({ ...s, loading: true }));
    try {
      const data = await getStatus();
      setStatusMap(data);
      lsSet(K_STATUS, data);
      setStatusState({ loading: false, error: null, fromCache: false, at: new Date() });
      return data;
    } catch (e) {
      const cached = lsGet(K_STATUS, null);
      if (cached) setStatusMap((cur) => (Object.keys(cur).length ? cur : cached));
      setStatusState({ loading: false, error: e.message, fromCache: !!cached, at: null });
      return null;
    }
  }, []);

  const loadAll = useCallback(
    async ({ force = false } = {}) => {
      if (bootRef.current && !force) {
        refreshStatus();
        return;
      }
      setBootState({ loading: true, error: null, fromCache: false });
      const [b] = await Promise.allSettled([getBootstrap(), refreshStatus()]);
      if (b.status === 'fulfilled') {
        bootRef.current = b.value;
        setBoot(b.value);
        lsSet(K_BOOT, b.value);
        setBootState({ loading: false, error: null, fromCache: false });
      } else {
        const cached = lsGet(K_BOOT, null);
        if (cached) {
          bootRef.current = cached;
          setBoot(cached);
          setBootState({ loading: false, error: b.reason?.message || null, fromCache: true });
        } else {
          setBootState({ loading: false, error: b.reason?.message || 'Gagal memuat data.', fromCache: false });
        }
      }
    },
    [refreshStatus]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const setPetugasId = useCallback((id) => {
    setPetugasIdState(id);
    lsSet(K_PETUGAS, id);
  }, []);

  const value = useMemo(
    () => ({ boot, bootState, statusMap, statusState, petugasId, setPetugasId, loadAll, refreshStatus }),
    [boot, bootState, statusMap, statusState, petugasId, setPetugasId, loadAll, refreshStatus]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
