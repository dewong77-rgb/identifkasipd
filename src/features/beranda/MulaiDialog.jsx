import { useState } from 'react';
import Dialog from '@/ui/Dialog.jsx';
import Button from '@/ui/Button.jsx';
import { DateInput } from '@/ui/Field.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { fmtDate, fmtDateTime, fmtNum, toYmd } from '@/core/lib/format.js';
import { normStatus } from '@/core/lib/status.js';
import StatusBadge from '@/ui/StatusBadge.jsx';
import { useMulai } from './useMulai.js';

export default function MulaiDialog({ target, tanggalAwal, jadwal, onClose }) {
  const { statusMap } = useApp();
  const [tanggal, setTanggal] = useState(toYmd(tanggalAwal));
  const { draft, busy, error, mulaiBaru, lanjutServer } = useMulai(target, tanggal);
  const entry = target.npsn ? statusMap[String(target.npsn)] : null;
  const st = normStatus(entry);
  const manual = target.sumber_lokus === 'manual';

  return (
    <Dialog title={target.nama_sekolah} onClose={onClose}>
      <p className="text-sm text-muted">
        {target.kab}
        {target.npsn ? `, NPSN ${target.npsn}` : ''}
      </p>
      {jadwal && <p className="mt-1 text-sm text-muted">Jadwal tim: {jadwal}</p>}
      {manual && <p className="mt-2 text-sm text-ink">Sekolah tambahan. Data dukung tidak tersedia untuk sekolah ini.</p>}

      <div className="mt-4">
        <DateInput
          label="Tanggal pelaksanaan"
          required
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          hint={tanggalAwal ? 'Terisi dari jadwal tim. Ubah bila pelaksanaan berbeda.' : 'Pilih tanggal kunjungan.'}
          error={!tanggal ? 'Tanggal wajib dipilih.' : ''}
        />
      </div>

      {entry && (
        <div className="mt-4 rounded-md border border-line bg-navy-50 p-3 text-sm">
          <div className="flex items-center gap-2">
            <StatusBadge status={st} />
            <span className="font-semibold">Sekolah ini sudah punya isian di server</span>
          </div>
          <p className="mt-1 text-muted">
            {fmtNum(entry.jml_butir_terisi)} dari 31 butir terisi. Diperbarui {fmtDateTime(entry.diperbarui_pada)}.
          </p>
        </div>
      )}
      {draft && (
        <p className="mt-3 rounded-md border border-gold bg-gold-50 p-3 text-sm">
          Ada isian yang belum terkirim di perangkat ini (disimpan {fmtDateTime(draft.savedAt)}).
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-navy">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {entry && (
          <Button variant={draft ? 'secondary' : 'primary'} onClick={lanjutServer} loading={busy} disabled={!tanggal}>
            Lanjutkan atau ubah isian dari server
          </Button>
        )}
        {draft && (
          <Button variant="primary" onClick={mulaiBaru} disabled={!tanggal || busy}>
            Lanjutkan isian di perangkat ini
          </Button>
        )}
        {!entry && !draft && (
          <Button onClick={mulaiBaru} disabled={!tanggal}>
            Mulai
          </Button>
        )}
        {entry && !draft && (
          <Button variant="ghost" onClick={mulaiBaru} disabled={!tanggal || busy}>
            Mulai dari kosong
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">Tanggal terpilih: {tanggal ? fmtDate(tanggal) : '-'}</p>
    </Dialog>
  );
}
