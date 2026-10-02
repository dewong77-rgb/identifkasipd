import { Link } from 'react-router-dom';
import PageHeader, { Card } from '@/ui/PageHeader.jsx';
import Icon from '@/ui/Icon.jsx';
import { PANDUAN } from './isi.js';

function Bagian({ b, no }) {
  return (
    <Card id={b.id} className="scroll-mt-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm text-white">{no}</span>
        {b.judul}
      </h2>
      {b.paragraf && (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
          {b.paragraf.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {b.poin && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
          {b.poin.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
      {b.langkah && (
        <ol className="mt-3 space-y-3">
          {b.langkah.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-navy text-xs font-bold text-navy">{i + 1}</span>
              <span className="text-sm leading-relaxed text-ink">
                <strong className="text-navy">{l.judul}.</strong> {l.isi}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

export default function Panduan() {
  return (
    <>
      <PageHeader title="Panduan penggunaan" subtitle="Bacalah sebelum berangkat ke sekolah. Waktu baca sekitar lima menit." />
      <nav aria-label="Daftar isi panduan" className="mb-5 flex flex-wrap gap-2">
        {PANDUAN.map((b, i) => (
          <a key={b.id} href={`#${b.id}`} className="inline-flex min-h-11 items-center rounded-md border border-line bg-white px-3 text-sm font-semibold text-navy hover:bg-navy-50">
            {i + 1}. {b.judul}
          </a>
        ))}
      </nav>
      <div className="space-y-4">
        {PANDUAN.map((b, i) => (
          <Bagian key={b.id} b={b} no={i + 1} />
        ))}
      </div>
      <div className="mt-6">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-dark">
          Mulai mengisi
          <Icon name="next" size={16} />
        </Link>
      </div>
    </>
  );
}
