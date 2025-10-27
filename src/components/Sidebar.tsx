// src/components/Sidebar.tsx (Versão Final com Link para Posts)
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Sidebar() {
  const { user, logout } = useAuth();

  // Se o user ainda não carregou (ProtectedRoute cuida disso, mas é segurança extra)
  if (!user) {
    return null; // Não renderiza nada se não houver usuário
  }

  const isAdmin = user.role === 'ADMIN';

  // Constrói a URL da imagem (com cache busting) ou usa placeholder
  const profileImageUrl = user.profileImageUrl
    ? `${API_URL}${user.profileImageUrl}?timestamp=${new Date().getTime()}`
    : '/default-avatar.png'; // Garanta que /public/default-avatar.png existe

  return (
    <aside className="sidebar"> {/* Estilos do index.css */}
      <div className="sidebar-header"> {/* Estilos do index.css */}
        <h2>Task Manager</h2>
      </div>

      {/* --- Perfil do Usuário na Sidebar --- */}
      {/* Renderiza a seção do perfil */}
      <div className="sidebar-profile"> {/* Estilos do index.css */}
        <img
          src={profileImageUrl}
          alt="Avatar"
          className="sidebar-avatar" // Estilos do index.css
          onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
        />
        <span className="sidebar-username">{user.name || 'Usuário'}</span> {/* Estilos do index.css */}
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav"> {/* Estilos do index.css */}
        <NavLink to="/" end>Minhas Tarefas</NavLink>
        <NavLink to="/profile">Meu Perfil</NavLink>
        <NavLink to="/posts">Postagens</NavLink> {/* <-- Link para Posts AQUI */}
        {isAdmin && (
          <NavLink to="/admin" className="admin-link">Painel Admin</NavLink>
        )}
      </nav>

      {/* Rodapé */}
      <div className="sidebar-footer"> {/* Estilos do index.css */}
        <button onClick={logout} className="logout-button-sidebar"> {/* Estilos do index.css */}
          Sair
        </button>
      </div>
    </aside>
  );
}