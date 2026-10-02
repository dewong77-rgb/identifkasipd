// Normalisasi status isian dari endpoint status.
export const STATUS = {
  belum: { key: 'belum', label: 'Belum diisi' },
  draft: { key: 'draft', label: 'Draft' },
  selesai: { key: 'selesai', label: 'Selesai' },
};

export function normStatus(entry) {
  if (!entry) return STATUS.belum;
  const s = String(entry.status_isian || '').toLowerCase();
  if (s === 'selesai') return STATUS.selesai;
  return STATUS.draft;
}
