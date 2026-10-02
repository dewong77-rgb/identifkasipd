import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from './AppContext.jsx';
import { clearDraft, loadDraft, saveDraft, targetKey } from '../lib/draftStore.js';
import { emptyStatus } from '../lib/statusSchema.js';
import { nowJakarta, toYmd } from '../lib/format.js';
import { sesiToForm } from '../lib/sesiMapper.js';

const Ctx = createContext(null);
export const useSession = () => useContext(Ctx);

const newForm = (petugasId, tanggal, awal = {}) => ({
  sesi_id: '',
  tanggal_pelaksanaan: toYmd(tanggal),
  pewawancara_ids: awal.pewawancara_ids?.length ? awal.pewawancara_ids : petugasId ? [petugasId] : [],
  pewawancara_manual: awal.pewawancara_manual || [],
  responden: [],
  status_ringkasan: emptyStatus(),
  jawaban: {},
  data_dukung_dilihat_pada: '',
});

// target: { sumber_lokus, lokus_id, npsn, nama_sekolah, prov, kab, kecamatan, tim_id, key }
export function SessionProvider({ children }) {
  const { boot, petugasId } = useApp();
  const [session, setSession] = useState(null); // { target, form, restored, result }
  const dirty = useRef(false);

  // Cadangan lokal: hanya saat isian berubah oleh petugas.
  useEffect(() => {
    if (session && dirty.current) saveDraft(session.target.key, { target: session.target, form: session.form });
  }, [session]);

  const beginNew = useCallback(
    (targetIn, tanggal, awal) => {
      const target = { ...targetIn, key: targetKey(targetIn) };
      const draft = loadDraft(target.key);
      dirty.current = false;
      if (draft) {
        // tanggal terbaru dari dialog menang atas draf bila petugas mengubahnya
        const form = { ...draft.form, tanggal_pelaksanaan: toYmd(tanggal) || draft.form.tanggal_pelaksanaan };
        setSession({ target: { ...target, ...draft.target, key: target.key }, form, restored: true, result: null });
      } else {
        setSession({ target, form: newForm(petugasId, tanggal, awal), restored: false, result: null });
      }
    },
    [petugasId]
  );

  const beginFromDraft = useCallback((draft) => {
    dirty.current = false;
    setSession({ target: draft.target, form: draft.form, restored: true, result: null });
  }, []);

  const beginFromServer = useCallback(
    (targetIn, sesiData, tanggal) => {
      const target = { ...targetIn, key: targetKey(targetIn) };
      const nameToId = {};
      (boot?.petugas || []).forEach((p) => {
        nameToId[String(p.nama).toLowerCase()] = p.petugas_id;
      });
      const form = sesiToForm(sesiData, { petugasNamaToId: nameToId });
      if (!form.tanggal_pelaksanaan) form.tanggal_pelaksanaan = toYmd(tanggal);
      dirty.current = false;
      setSession({ target, form, restored: false, result: null });
    },
    [boot]
  );

  const updateForm = useCallback((fnOrPatch) => {
    dirty.current = true;
    setSession((s) =>
      s ? { ...s, restored: s.restored, form: typeof fnOrPatch === 'function' ? fnOrPatch(s.form) : { ...s.form, ...fnOrPatch } } : s
    );
  }, []);
  const updateTarget = useCallback((patch) => {
    dirty.current = true;
    setSession((s) => (s ? { ...s, target: { ...s.target, ...patch } } : s));
  }, []);
  const setJawaban = useCallback((kode, val) => updateForm((f) => ({ ...f, jawaban: { ...f.jawaban, [kode]: val } })), [updateForm]);
  const setStatusField = useCallback(
    (k, v) => updateForm((f) => ({ ...f, status_ringkasan: { ...f.status_ringkasan, [k]: v } })),
    [updateForm]
  );
  const dismissRestored = useCallback(() => setSession((s) => (s ? { ...s, restored: false } : s)), []);

  const markDilihat = useCallback(() => {
    dirty.current = true;
    setSession((s) =>
      s && !s.form.data_dukung_dilihat_pada ? { ...s, form: { ...s.form, data_dukung_dilihat_pada: nowJakarta() } } : s
    );
  }, []);

  // Dipanggil hanya setelah respons ok:true.
  const finishSubmit = useCallback((result) => {
    dirty.current = false;
    setSession((s) => {
      if (!s) return s;
      clearDraft(s.target.key);
      return { ...s, restored: false, result, form: { ...s.form, sesi_id: result.sesi_id || s.form.sesi_id } };
    });
  }, []);

  const reset = useCallback(() => {
    dirty.current = false;
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session, beginNew, beginFromDraft, beginFromServer, updateForm, updateTarget,
      setJawaban, setStatusField, markDilihat, dismissRestored, finishSubmit, reset,
    }),
    [session, beginNew, beginFromDraft, beginFromServer, updateForm, updateTarget, setJawaban, setStatusField, markDilihat, dismissRestored, finishSubmit, reset]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
