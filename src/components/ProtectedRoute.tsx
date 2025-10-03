import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const auth = useAuth();

  // Se o auth não foi carregado ainda, não faça nada (pode mostrar uma tela de loading)
  if (auth?.loading) {
    return <div>Carregando...</div>;
  }

  // Agora que o loading terminou, tome a decisão
  // Se não estiver autenticado, redireciona para o login
  return auth?.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}