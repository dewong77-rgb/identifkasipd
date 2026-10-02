import { createContext, useCallback, useContext, useState } from 'react';

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, ms = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setItems((l) => [...l, { id, message }]);
    setTimeout(() => setItems((l) => l.filter((x) => x.id !== id)), ms);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto max-w-md rounded-md bg-ink px-4 py-3 text-sm text-white shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
