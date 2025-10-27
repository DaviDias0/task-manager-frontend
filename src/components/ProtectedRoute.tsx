import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  // Pega user, isAuthenticated, loading, e logout
  const { user, isAuthenticated, loading, logout } = useAuth();
  console.log("[ProtectedRoute] Check - Loading:", loading, "| IsAuthenticated:", isAuthenticated, "| User:", user ? user.email : null);

  // Se o AuthContext ainda está carregando o estado inicial do token/perfil
  if (loading) {
    console.log("[ProtectedRoute] Loading state is true, returning null.");
    return null; // Ou um componente de loading global
  }

  // Se terminou de carregar E NÃO está autenticado
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] Not Authenticated after load, redirecting to /login.");
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, mas o objeto user é null (estado inconsistente)
  if (!user) {
     console.warn("[ProtectedRoute] Inconsistent State: Authenticated but user is null! Logging out.");
     logout(); // Força logout para limpar
     return null; // Retorna null enquanto desloga/redireciona
  }

  // Se chegou aqui, está carregado, autenticado e tem objeto user
  console.log("[ProtectedRoute] Authenticated and user exists, rendering Outlet.");
  return <Outlet />;
}