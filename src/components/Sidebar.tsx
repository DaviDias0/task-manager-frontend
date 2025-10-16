// src/components/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const auth = useAuth();

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
        {/* A LINHA ABAIXO FOI DESCOMENTADA */}
        <NavLink to="/profile">Meu Perfil</NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button-sidebar">
          Sair
        </button>
      </div>
    </aside>
  );
}