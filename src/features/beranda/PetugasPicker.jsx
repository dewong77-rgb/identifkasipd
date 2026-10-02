import { useMemo } from 'react';
import Combobox from '@/ui/Combobox.jsx';

export default function PetugasPicker({ petugas, value, onChange }) {
  const options = useMemo(
    () => [...petugas].sort((a, b) => a.nama.localeCompare(b.nama, 'id')).map((p) => ({ value: p.petugas_id, label: p.nama })),
    [petugas]
  );
  return <Combobox label="Nama petugas" hint="Pilih nama Anda. Pilihan diingat di perangkat ini." options={options} value={value} onSelect={onChange} placeholder="Ketik nama Anda" />;
}
