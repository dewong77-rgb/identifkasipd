import Icon from '@/ui/Icon.jsx';
import { kodeButir, nomorButir } from '@/core/lib/instrumen.js';

const Item = ({ aktif, selesai, children, onClick, wide }) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={aktif ? 'step' : undefined}
    className={`flex min-h-11 items-center gap-2 rounded-md border text-sm font-semibold ${wide ? 'w-full px-3 text-left' : 'min-w-11 justify-center px-2'} ${
      aktif ? 'border-navy bg-navy text-white' : selesai ? 'border-navy bg-navy-50 text-navy' : 'border-line bg-white text-muted hover:bg-navy-50'
    }`}
  >
    {wide && <Icon name={selesai ? 'check' : 'circle'} size={15} strokeWidth={2.5} />}
    {children}
  </button>
);

// Daftar bagian dan butir di samping. Di layar sempit tampil sebagai panel lipat.
export default function Sidebar({ bagian, current, done, onGo, terisi, total }) {
  const isi = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Item wide aktif={current === 'identitas'} selesai={done.identitas} onClick={() => onGo('identitas')}>
          Identitas dan narasumber
        </Item>
        <Item wide aktif={current === 'status'} selesai={done.status} onClick={() => onGo('status')}>
          Ringkasan status
        </Item>
      </div>
      {bagian.map((g) => (
        <div key={g.kode}>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            Bagian {g.kode}: {g.nama}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((b) => {
              const k = kodeButir(b);
              return (
                <Item key={k} aktif={current === k} selesai={done[k]} onClick={() => onGo(k)}>
                  {nomorButir(b)}
                </Item>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <nav aria-label="Daftar bagian dan butir">
      <details className="rounded-lg border border-line bg-white lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between px-3 text-sm font-semibold text-navy">
          <span>Daftar bagian dan butir</span>
          <span className="text-xs text-muted">
            {terisi} dari {total} terisi
          </span>
        </summary>
        <div className="border-t border-line p-3">{isi}</div>
      </details>
      <div className="hidden max-h-[calc(100vh-6rem)] overflow-auto rounded-lg border border-line bg-white p-3 lg:sticky lg:top-4 lg:block">{isi}</div>
    </nav>
  );
}
