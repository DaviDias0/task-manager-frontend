// src/pages/AdminPage.tsx

import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';
import { toast } from 'react-toastify';

// Tipo para os dados do usuário (sem a senha)
interface User {
  id: number;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Erro ao buscar lista de usuários.');
        console.error("Erro detalhado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Roda apenas uma vez

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <h1>Carregando usuários...</h1>; // Podemos usar Skeleton aqui depois
  }

  return (
    <div className="admin-page">
      <h1>Painel de Administração - Usuários</h1>
      
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table className="admin-user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Membro Desde</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name || '-'}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}