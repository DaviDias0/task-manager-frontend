// src/components/Sidebar.tsx

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: 'USER' | 'ADMIN';
}

export function Sidebar() {
  const auth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifica o cargo do usuário quando o componente carrega
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(token);
        if (decodedToken.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token na sidebar:", error);
      }
    }
  }, [auth?.isAuthenticated]); // Re-verifica se o estado de autenticação mudar

  const handleLogout = () => {
    if (auth) {
      auth.logout();
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Task Manager</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>Minhas Tarefas</NavLink>
        <NavLink to="/profile">Meu Perfil</NavLink>
        
        {/* --- LINK CONDICIONAL AQUI --- */}
        {isAdmin && (
          <NavLink to="/admin" className="admin-link">Painel Admin</NavLink>
        )}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button-sidebar">
          Sair
        </button>
      </div>
    </aside>
  );
}