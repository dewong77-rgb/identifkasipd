// Satu-satunya tempat yang tahu bentuk data butir dari bootstrap.
// Bila format no_butir berubah, cukup ubah file ini.
export function kodeButir(b) {
  const n = parseInt(String(b.no_butir).replace(/\D+/g, ''), 10);
  return `B${String(n).padStart(2, '0')}`;
}
export const nomorButir = (b) => parseInt(String(b.no_butir).replace(/\D+/g, ''), 10);
export const isButir15 = (b) => nomorButir(b) === 15;

export function groupBagian(butir = []) {
  const map = new Map();
  [...butir]
    .sort((a, b) => nomorButir(a) - nomorButir(b))
    .forEach((b) => {
      const k = b.kode_bagian;
      if (!map.has(k)) map.set(k, { kode: k, nama: b.bagian, items: [] });
      map.get(k).items.push(b);
    });
  return [...map.values()].sort((a, b) => String(a.kode).localeCompare(String(b.kode)));
}

export const TIDAK_DITANYAKAN = 'tidak ditanyakan';
