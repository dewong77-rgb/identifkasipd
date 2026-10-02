export const Skeleton = ({ className = 'h-5 w-full' }) => <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;

export function SkeletonList({ rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Memuat">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-lg border border-line p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
