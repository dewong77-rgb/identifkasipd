import { Navigate } from 'react-router-dom';
import { useSession } from '@/core/context/SessionContext.jsx';

export default function RequireSession({ children }) {
  const { session } = useSession();
  if (!session) return <Navigate to="/" replace />;
  return children;
}
