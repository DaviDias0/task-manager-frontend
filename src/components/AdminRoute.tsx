// src/components/AdminRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Precisaremos instalar esta biblioteca

interface TokenPayload {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export function AdminRoute() {
  const auth = useAuth();
  const token = localStorage.getItem('token');

  // Se não estiver autenticado, redireciona para o login
  if (!auth?.isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    
    // Se a role não for 'ADMIN', redireciona para a página principal
    if (decodedToken.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Se o token for inválido, redireciona para o login
    console.error("Token inválido:", error);
    return <Navigate to="/login" replace />;
  }

  // Se tudo estiver certo, renderiza a página de admin
  return <Outlet />;
}
