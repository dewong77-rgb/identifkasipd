import { Link } from 'react-router-dom';
import { Card } from '@/ui/PageHeader.jsx';
import Icon from '@/ui/Icon.jsx';

const hrefOf = (i) => {
  if (i.step === 'dukung') return '/dukung';
  if (i.kode) return `/wawancara?step=${i.step}&q=${i.kode}&cek=1`;
  return `/wawancara?step=${i.step}&cek=1`;
};

// Daftar masalah yang bisa diklik untuk melompat ke bagian terkait.
export default function DaftarMasalah({ issues }) {
  if (!issues.length) return null;
  const butir = issues.filter((i) => i.kode);
  const lain = issues.filter((i) => !i.kode);
  return (
    <Card role="alert" className="border-navy bg-navy-50">
      <p className="flex items-center gap-2 font-bold text-navy">
        <Icon name="alert" size={18} />
        Belum bisa dikirim. Lengkapi dulu {issues.length} hal berikut.
      </p>
      {lain.length > 0 && (
        <ul className="mt-2 space-y-1">
          {lain.map((i, k) => (
            <li key={k}>
              <Link to={hrefOf(i)} className="inline-flex min-h-11 items-center text-sm text-ink underline">
                {i.message}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {butir.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-semibold">Butir kosong ({butir.length}), ketuk untuk melompat:</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {butir.map((i) => (
              <Link key={i.kode} to={hrefOf(i)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-navy bg-white px-3 text-sm font-bold text-navy hover:bg-gold-50">
                {i.kode}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
