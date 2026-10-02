import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/core/context/AppContext.jsx';
import { SessionProvider } from '@/core/context/SessionContext.jsx';
import { ToastProvider } from '@/ui/Toast.jsx';
import { SkeletonList } from '@/ui/Skeleton.jsx';
import Layout from './Layout.jsx';
import RequireSession from './RequireSession.jsx';
import { ROUTES } from './routes.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <SessionProvider>
          <Layout>
            <Suspense fallback={<SkeletonList rows={3} />}>
              <Routes>
                {ROUTES.map(({ path, Component, needsSession }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      needsSession ? (
                        <RequireSession>
                          <Component />
                        </RequireSession>
                      ) : (
                        <Component />
                      )
                    }
                  />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </SessionProvider>
      </AppProvider>
    </ToastProvider>
  );
}
