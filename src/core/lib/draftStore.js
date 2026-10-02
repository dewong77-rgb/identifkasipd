import { lsGet, lsSet, lsRemove, lsKeys } from './storage.js';

const P = 'ipd:draft:';

// Kunci draf: NPSN bila ada, selain itu id sekolah manual.
export function targetKey(target) {
  if (target.key) return target.key;
  return target.npsn ? `npsn-${target.npsn}` : `manual-${Date.now().toString(36)}`;
}
export const loadDraft = (key) => lsGet(P + key, null);
export const saveDraft = (key, draft) => lsSet(P + key, { ...draft, savedAt: new Date().toISOString() });
export const clearDraft = (key) => lsRemove(P + key);
export function listDrafts() {
  return lsKeys(P)
    .map((k) => lsGet(k, null))
    .filter(Boolean)
    .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
}
