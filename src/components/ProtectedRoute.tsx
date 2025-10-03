import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const auth = useAuth();

  // Se o auth ainda não carregou, podemos mostrar um "loading"
  if (auth === undefined) {
    return <div>Carregando...</div>;
  }

  // Se o auth diz que não está autenticado, redireciona para o login
  return auth?.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}