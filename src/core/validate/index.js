import { validateIdentitas } from './identitas.js';
import { validateStatus } from './status.js';
import { validateButir, butirKosong } from './butir.js';
import { validateDukung } from './dukung.js';

export { butirKosong };

export function validateAll(ctx) {
  return [
    ...validateDukung(ctx),
    ...validateIdentitas(ctx),
    ...validateStatus(ctx),
    ...validateButir(ctx),
  ];
}

export function groupByStep(issues) {
  const m = {};
  issues.forEach((i) => {
    (m[i.step] ||= []).push(i);
  });
  return m;
}

// Tebak bagian layar dari pesan galat server (untuk tombol "Periksa bagian ini").
export function guessStepFromMessage(msg, bagianKodes = []) {
  const t = String(msg).toLowerCase();
  const b = t.match(/\bb(\d{1,2})\b/);
  if (b) return { step: 'butir', butirNo: Number(b[1]) };
  if (/\bs[1-8]\b|status|residu|dapodik|sinkron/.test(t)) return { step: 'status' };
  if (/dukung/.test(t)) return { step: 'dukung' };
  return { step: 'identitas' };
}
