import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from 'recharts';
import { Card } from '@/ui/PageHeader.jsx';
import { fmtNum } from '@/core/lib/format.js';

const LABELS = ['PD 2023', 'PD 2024', 'PD 2025', 'PD BOSP 2026', 'PD BOSP 2027', 'PD Dapodik terbaru'];
const KEYS = ['pd_2023', 'pd_2024', 'pd_2025', 'pd_bos_2026', 'pd_bos_2027', 'pd_dapo_update'];
const BOSP = new Set(['PD BOSP 2026', 'PD BOSP 2027']);

const num = (v) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v));

function Tick({ x, y, payload }) {
  const words = String(payload.value).split(' ');
  const lines = [];
  words.forEach((w) => {
    const last = lines[lines.length - 1];
    if (last && (last + " " + w).length <= 6) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
  });
  return (
    <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill="#5B6573">
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 13}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

function Dot({ cx, cy, payload, value }) {
  if (cx == null || cy == null || value == null) return null;
  const khusus = BOSP.has(payload.name);
  return khusus ? (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#E8A020" stroke="#1A3E6F" strokeWidth={2} />
    </g>
  ) : (
    <circle cx={cx} cy={cy} r={4.5} fill="#1A3E6F" />
  );
}

export default function TrendChart({ sekolah }) {
  const data = LABELS.map((name, i) => ({ name, v: num(sekolah[KEYS[i]]) }));
  const ada = data.filter((d) => d.v !== null).length;
  return (
    <Card aria-label="Tren peserta didik">
      <h2 className="text-base font-bold text-navy">Tren jumlah peserta didik</h2>
      <p className="mb-2 text-sm text-muted">Titik emas menandai data BOSP 2026 dan BOSP 2027. Garis terputus berarti data tidak tersedia.</p>
      {ada === 0 ? (
        <p className="py-8 text-center text-sm text-muted">Belum ada data tren untuk sekolah ini.</p>
      ) : (
        <div className="h-72 w-full" role="img" aria-label={`Grafik garis: ${data.map((d) => `${d.name} ${d.v === null ? 'tidak ada data' : fmtNum(d.v)}`).join(', ')}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 24, right: 20, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#E5E9EF" vertical={false} />
              <XAxis dataKey="name" interval={0} tick={<Tick />} height={50} tickLine={false} />
              <YAxis domain={['auto', 'auto']} width={46} tick={{ fontSize: 11, fill: '#5B6573' }} tickFormatter={fmtNum} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [fmtNum(v), 'Peserta didik']} />
              <Line type="monotone" dataKey="v" stroke="#1A3E6F" strokeWidth={2.5} connectNulls={false} dot={<Dot />} activeDot={false} isAnimationActive={false}>
                <LabelList dataKey="v" position="top" formatter={(v) => (v == null ? '' : fmtNum(v))} style={{ fontSize: 11, fill: '#2F3640', fontWeight: 600 }} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
