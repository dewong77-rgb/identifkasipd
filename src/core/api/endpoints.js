import { apiGet, apiPost } from './client.js';

export const getBootstrap = () => apiGet('bootstrap').then((r) => r.data);
export const getStatus = () => apiGet('status').then((r) => r.data || {});
export const getDukung = (npsn) => apiGet('dukung', { npsn }).then((r) => r.data);
export const getSesi = ({ npsn, sesi_id }) => apiGet('sesi', { npsn, sesi_id }).then((r) => r.data);
export const submitSesi = (payload) => apiPost({ ...payload, action: 'submit' }, { timeoutMs: 30000 });
