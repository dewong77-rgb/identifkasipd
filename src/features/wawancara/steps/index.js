import { groupBagian } from '@/core/lib/instrumen.js';
import { validateIdentitas } from '@/core/validate/identitas.js';
import { validateStatus } from '@/core/validate/status.js';
import { validateButir } from '@/core/validate/butir.js';
import Identitas from './Identitas.jsx';
import Status from './Status.jsx';
import Bagian from './Bagian.jsx';

// Daftar langkah wizard. Menambah langkah baru: buat komponen, lalu tambahkan di sini.
// check(ctx) mengembalikan daftar masalah untuk langkah itu (kosong berarti lengkap).
export function buildSteps(butir) {
  const bagian = groupBagian(butir);
  return [
    { id: 'identitas', label: 'Identitas', title: 'Identitas dan narasumber', Component: Identitas, check: (c) => validateIdentitas(c) },
    { id: 'status', label: 'Status', title: 'Ringkasan status (S1 sampai S8)', Component: Status, check: (c) => validateStatus(c) },
    ...bagian.map((b) => ({
      id: `bagian-${b.kode}`,
      label: `Bagian ${b.kode}`,
      title: `Bagian ${b.kode}: ${b.nama}`,
      Component: Bagian,
      props: { kode: b.kode },
      check: (c) => validateButir(c).filter((i) => i.step === `bagian-${b.kode}`),
    })),
  ];
}
