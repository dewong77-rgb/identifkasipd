import { useApp } from '@/core/context/AppContext.jsx';
import { SkeletonList } from '@/ui/Skeleton.jsx';
import ErrorPanel from '@/ui/ErrorPanel.jsx';
import Icon from '@/ui/Icon.jsx';

// Membungkus layar yang butuh data bootstrap.
export default function BootGate({ children }) {
  const { boot, bootState, loadAll } = useApp();
  if (!boot && bootState.loading) return <SkeletonList rows={5} />;
  if (!boot) {
    return <ErrorPanel title="Data belum dapat dimuat" message={bootState.error || 'Periksa sinyal, lalu coba lagi.'} onRetry={() => loadAll({ force: true })} />;
  }
  return (
    <>
      {bootState.fromCache && (
        <div role="status" className="mb-4 flex items-start gap-2 rounded-md border border-gold bg-gold-50 p-3 text-sm">
          <Icon name="info" size={18} className="mt-0.5 shrink-0" />
          <span>
            Data dari penyimpanan perangkat. Sinyal belum tersambung ke server.{' '}
            <button type="button" className="font-semibold text-navy underline" onClick={() => loadAll({ force: true })}>
              Muat ulang
            </button>
          </span>
        </div>
      )}
      {children}
    </>
  );
}
