import { kodeButir, groupBagian } from '@/core/lib/instrumen.js';
import { validateIdentitas } from '@/core/validate/identitas.js';
import { validateStatus } from '@/core/validate/status.js';
import { validateButir } from '@/core/validate/butir.js';
import Identitas from './Identitas.jsx';
import Status from './Status.jsx';
import Butir from './Butir.jsx';

// Urutan alur wawancara: Identitas, Status, lalu B01 sampai B31 satu per satu.
// Tombol Lanjut mengalir melewati semua langkah. Menambah langkah: tambahkan di sini.
export function buildSteps(butir) {
  const urut = groupBagian(butir).flatMap((g) => g.items);
  return [
    { id: 'identitas', label: 'Identitas dan narasumber', Component: Identitas, check: (c) => validateIdentitas(c) },
    { id: 'status', label: 'Ringkasan status (S1 sampai S8)', Component: Status, check: (c) => validateStatus(c) },
    ...urut.map((b) => {
      const kode = kodeButir(b);
      return {
        id: kode,
        butir: b,
        bagian: b.kode_bagian,
        label: `Butir ${kode}`,
        Component: Butir,
        props: { butir: b },
        check: (c) => validateButir(c).filter((i) => i.kode === kode),
      };
    }),
  ];
}

export const bagianList = (butir) => groupBagian(butir);
