import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const auth = useAuth();
  if (auth?.loading) {
    return <div>Carregando...</div>;
  }
  return auth?.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}