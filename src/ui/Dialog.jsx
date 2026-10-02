import { useEffect } from 'react';
import Icon from './Icon.jsx';

export default function Dialog({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`max-h-[92vh] w-full overflow-auto rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="-mr-2 -mt-1 flex h-11 w-11 items-center justify-center rounded-md text-muted hover:bg-navy-50">
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
