// Satu-satunya tempat fetch ke Apps Script. Semua modul lain lewat endpoints.js.
const BASE = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, { code = 'JARINGAN', detail = null, extra = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.detail = detail;
    this.extra = extra;
  }
}

async function run(url, init, timeoutMs) {
  if (!BASE) {
    throw new ApiError('Alamat server belum diatur (VITE_API_URL).', { code: 'KONFIGURASI' });
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let text;
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    text = await res.text();
  } catch (e) {
    if (e && e.name === 'AbortError') {
      throw new ApiError('Waktu tunggu habis. Periksa sinyal, lalu coba lagi.', { code: 'TIMEOUT' });
    }
    throw new ApiError('Tidak dapat terhubung ke server. Periksa sinyal, lalu coba lagi.', { code: 'JARINGAN' });
  } finally {
    clearTimeout(timer);
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ApiError('Server mengirim respons yang tidak dapat dibaca. Coba lagi beberapa saat lagi.', { code: 'RESPONS' });
  }
  if (!json || typeof json !== 'object') {
    throw new ApiError('Server mengirim respons yang tidak dapat dibaca.', { code: 'RESPONS' });
  }
  if (json.ok !== true) {
    throw new ApiError(json.error || 'Permintaan ditolak server.', {
      code: json.code || 'SERVER',
      detail: json.detail ?? null,
      extra: json,
    });
  }
  return json;
}

export function apiGet(action, params = {}, { timeoutMs = 25000 } = {}) {
  const q = new URLSearchParams({ action });
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  });
  const sep = BASE && BASE.includes('?') ? '&' : '?';
  return run(`${BASE}${sep}${q.toString()}`, { method: 'GET' }, timeoutMs);
}

export function apiPost(payload, { timeoutMs = 30000 } = {}) {
  // text/plain wajib agar tidak ada preflight CORS. Jangan tambah header lain.
  return run(
    BASE,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    },
    timeoutMs
  );
}
