// Pembungkus localStorage yang aman bila diblokir atau penuh.
export function lsGet(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
export function lsSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function lsRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* abaikan */
  }
}
export function lsKeys(prefix) {
  const out = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) out.push(k);
    }
  } catch {
    /* abaikan */
  }
  return out;
}
