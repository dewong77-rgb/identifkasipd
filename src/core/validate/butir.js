import { kodeButir, isButir15 } from '../lib/instrumen.js';

// b15Hidden: true bila butir 15 tidak ditanyakan karena tidak ada selisih.
export function butirKosong({ form, butir, b15Hidden }) {
  return butir
    .filter((b) => !(isButir15(b) && b15Hidden))
    .filter((b) => !String(form.jawaban[kodeButir(b)] ?? '').trim());
}

export function validateButir({ form, butir, b15Hidden }) {
  return butirKosong({ form, butir, b15Hidden }).map((b) => ({
    step: `bagian-${b.kode_bagian}`,
    field: kodeButir(b),
    kode: kodeButir(b),
    message: `Butir ${kodeButir(b)} belum diisi.`,
  }));
}
