import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSession } from '@/core/context/SessionContext.jsx';
import { ROUTES } from './routes.jsx';

export default function Layout({ children }) {
  const { session } = useSession();
  const lebar = useLocation().pathname.startsWith('/wawancara') ? 'max-w-7xl' : 'max-w-5xl';
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white">
        <div className={`mx-auto flex ${lebar} items-center justify-between gap-3 px-4 py-2`}>
          <Link to="/" className="min-w-0 py-2 text-sm font-bold leading-tight text-navy">
            Identifikasi Pengelolaan Data Peserta Didik
          </Link>
          <nav aria-label="Menu utama" className="flex shrink-0 gap-1">
            {ROUTES.filter((r) => r.nav).map((r) => (
              <NavLink
                key={r.path}
                to={r.path}
                end
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-md px-3 text-sm font-semibold ${isActive ? 'bg-navy-50 text-navy underline decoration-gold decoration-2 underline-offset-8' : 'text-muted hover:bg-navy-50'}`
                }
              >
                {r.title}
              </NavLink>
            ))}
          </nav>
        </div>
        {session && (
          <div className="border-t border-line bg-navy-50">
            <p className={`mx-auto ${lebar} truncate px-4 py-1.5 text-xs text-navy`}>
              Sekolah aktif: <span className="font-semibold">{session.target.nama_sekolah}</span>
            </p>
          </div>
        )}
      </header>
      <main className={`mx-auto w-full ${lebar} flex-1 px-4 py-6`}>{children}</main>
      <footer className="border-t border-line py-4 text-center text-xs text-muted">Direktorat SMA | Kemendikdasmen</footer>
    </div>
  );
}
