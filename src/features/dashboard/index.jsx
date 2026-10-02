import { useEffect, useMemo, useState } from 'react';
import BootGate from '@/app/BootGate.jsx';
import PageHeader from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { fmtDateTime } from '@/core/lib/format.js';
import { useDashboardData } from './useDashboardData.js';
import SummaryCards from './SummaryCards.jsx';
import ProgressGroups from './ProgressGroups.jsx';
import Filters from './Filters.jsx';
import LokusTable from './LokusTable.jsx';
import SekolahTambahan from './SekolahTambahan.jsx';

const F0 = { q: '', tahap: '', kab: '', status: '', sort: 'tahap', dir: 'asc' };
const ORDER = { belum: 0, draft: 1, selesai: 2 };

function sortVal(r, k) {
  if (k === 'status') return ORDER[r.status.key];
  if (k === 'terisi') return r.terisi;
  return String(r[k] ?? '');
}

function Isi() {
  const { boot, statusMap, statusState, refreshStatus } = useApp();
  const d = useDashboardData(boot, statusMap);
  const [f, setF] = useState(F0);
  const set = (p) => setF((x) => ({ ...x, ...p }));

  // Perbarui otomatis tiap 60 detik, hanya bila tab terlihat.
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') refreshStatus();
    }, 60000);
    return () => clearInterval(t);
  }, [refreshStatus]);

  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const out = d.rows.filter(
      (r) => (!f.tahap || r.tahap === f.tahap) && (!f.kab || r.kab === f.kab) && (!f.status || r.status.key === f.status) && (!q || `${r.nama} ${r.npsn}`.toLowerCase().includes(q))
    );
    const dir = f.dir === 'asc' ? 1 : -1;
    return out.sort((a, b) => {
      const x = sortVal(a, f.sort);
      const y = sortVal(b, f.sort);
      const c = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'id', { numeric: true });
      return (c || a.nama.localeCompare(b.nama, 'id')) * dir;
    });
  }, [d.rows, f]);

  return (
    <>
      <PageHeader
        title="Dashboard progres"
        subtitle={statusState.at ? `Diperbarui ${fmtDateTime(statusState.at.toISOString())}. Otomatis tiap 60 detik saat tab terlihat.` : 'Memuat status terbaru.'}
        actions={
          <Button variant="secondary" onClick={refreshStatus} loading={statusState.loading}>
            <Icon name="refresh" size={16} />
            Muat ulang
          </Button>
        }
      />
      {statusState.error && (
        <p role="alert" className="mb-4 rounded-md border border-gold bg-gold-50 p-3 text-sm">
          Status terbaru belum dapat dimuat: {statusState.error}
          {statusState.fromCache ? ' Menampilkan data terakhir dari perangkat ini.' : ''}
        </p>
      )}
      <div className="space-y-5">
        <SummaryCards s={d.summary} />
        <ProgressGroups perTahap={d.perTahap} perKab={d.perKab} />
        <section aria-label="Daftar lokus" className="space-y-3">
          <h2 className="text-lg font-bold text-navy">Daftar lokus ({rows.length} dari {d.rows.length})</h2>
          <Filters f={f} set={set} tahapList={d.tahapList} kabList={d.kabList} onReset={() => setF(F0)} />
          <LokusTable rows={rows} />
        </section>
        <SekolahTambahan rows={d.tambahan} />
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <BootGate>
      <Isi />
    </BootGate>
  );
}
