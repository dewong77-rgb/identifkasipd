const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const nf = new Intl.NumberFormat('id-ID');
const empty = (v) => v === null || v === undefined || v === '' || Number.isNaN(Number(v));

export const fmtNum = (v) => (empty(v) ? '-' : nf.format(Number(v)));
export const fmtSigned = (v) => {
  if (empty(v)) return '-';
  const n = Number(v);
  return n > 0 ? `+${nf.format(n)}` : n < 0 ? `-${nf.format(Math.abs(n))}` : '0';
};
// pecahan 0.0458 menjadi "4,58%"
export const fmtPct = (frac, digits = 2) =>
  empty(frac)
    ? '-'
    : `${(Number(frac) * 100).toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
// skala 0 sampai 100 menjadi "92,5"
export const fmtScore = (v) =>
  empty(v) ? '-' : Number(v).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const JKT = { timeZone: 'Asia/Jakarta' };

// Terima 'yyyy-mm-dd', ISO bertanda zona, atau Date. Hasil 'yyyy-mm-dd' (tanggal Jakarta) atau ''.
export function toYmd(v) {
  if (!v) return '';
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('sv-SE', { ...JKT, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function fmtDate(v) {
  const ymd = toYmd(v);
  if (!ymd) return '-';
  const [y, m, d] = ymd.split('-').map(Number);
  return `${d} ${BULAN[m - 1]} ${y}`;
}

export function fmtDateTime(v) {
  if (!v) return '-';
  const s = String(v);
  let ymd;
  let hm;
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s)) {
    ymd = s.slice(0, 10);
    hm = s.slice(11, 16);
  } else {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    const parts = new Intl.DateTimeFormat('sv-SE', {
      ...JKT, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(d);
    ymd = parts.slice(0, 10);
    hm = parts.slice(11, 16);
  }
  return `${fmtDate(ymd)}, ${hm.replace(':', '.')}`;
}

// 'yyyy-MM-dd HH:mm:ss' zona Asia/Jakarta
export function nowJakarta() {
  return new Intl.DateTimeFormat('sv-SE', {
    ...JKT, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).format(new Date());
}
export const todayJakarta = () => nowJakarta().slice(0, 10);

export function fmtRange(a, b) {
  const x = toYmd(a);
  const y = toYmd(b);
  if (!x) return '-';
  if (!y || x === y) return fmtDate(x);
  return `${fmtDate(x)} sampai ${fmtDate(y)}`;
}

export const digitsOnly = (s) => String(s ?? '').replace(/\D+/g, '');
