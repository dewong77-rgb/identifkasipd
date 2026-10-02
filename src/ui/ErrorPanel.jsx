import Icon from './Icon.jsx';
import Button from './Button.jsx';

export default function ErrorPanel({ title = 'Terjadi kendala', message, detail, onRetry, retryLabel = 'Coba lagi', children }) {
  const list = Array.isArray(detail) ? detail : detail ? [String(detail)] : [];
  return (
    <div role="alert" className="rounded-lg border border-navy bg-navy-50 p-4">
      <div className="flex items-start gap-3">
        <Icon name="alert" className="mt-0.5 shrink-0 text-navy" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-navy">{title}</p>
          {message && <p className="mt-1 text-sm text-ink">{message}</p>}
          {list.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
              {list.map((d, i) => (
                <li key={i}>{typeof d === 'string' ? d : JSON.stringify(d)}</li>
              ))}
            </ul>
          )}
          {children}
          {onRetry && (
            <Button variant="primary" className="mt-3" onClick={onRetry}>
              <Icon name="refresh" size={16} />
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
