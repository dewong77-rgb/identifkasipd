import { Card } from '@/ui/PageHeader.jsx';
import ProgressBar from '@/ui/ProgressBar.jsx';
import { fmtNum } from '@/core/lib/format.js';

function Group({ title, items }) {
  return (
    <Card>
      <h2 className="mb-3 font-bold text-navy">{title}</h2>
      <div className="space-y-3">
        {items.map((g) => (
          <ProgressBar key={g.key} value={g.selesai} max={g.total} label={g.label} right={`${fmtNum(g.selesai)} dari ${fmtNum(g.total)}`} />
        ))}
      </div>
    </Card>
  );
}

export default function ProgressGroups({ perTahap, perKab }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Group title="Progres per tahap" items={perTahap} />
      <Group title="Progres per kabupaten atau kota" items={perKab} />
    </div>
  );
}
