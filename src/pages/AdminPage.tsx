// src/pages/AdminPage.tsx

import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser as deleteUserApi, updateUserRole } from '../services/api';
import { toast } from 'react-toastify';
import type { Role } from '../types/types';

interface User {
  id: number;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// type Role = 'USER' | 'ADMIN'; // Descomente se Role não estiver em types.ts

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar usuários (sem logs agora)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Erro ao buscar lista de usuários.');
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para deletar usuário (com UI Otimista e proteção)
  const handleDeleteUser = async (userId: number, userEmail: string) => {
    const userToDelete = users.find(u => u.id === userId);
    console.log('Tentando deletar:', userToDelete); // Log de debug

    // Verificação de segurança ANTES de qualquer ação
    if (userToDelete && userToDelete.role === 'ADMIN') {
      console.log('ADMIN detectado, mostrando aviso.'); // Log de debug
      toast.warn('Não é permitido deletar um administrador pelo painel.');
      return; // Interrompe a função
    }

    // Se NÃO for admin, pede confirmação
    console.log('Não é admin, pedindo confirmação.'); // Log de debug
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${userEmail}? Esta ação NÃO PODE ser desfeita e deletará TODAS AS TAREFAS associadas!`)) {
      const originalUsers = [...users];
      setUsers(users.filter(user => user.id !== userId));
      toast.info(`Deletando usuário ${userEmail}...`);
      try {
        await deleteUserApi(userId);
        toast.success(`Usuário ${userEmail} deletado com sucesso!`);
      } catch (error: any) {
        console.error("Erro ao deletar usuário:", error);
        toast.error(`Falha ao deletar usuário ${userEmail}. ${error.response?.data?.message || 'Erro desconhecido.'}`);
        setUsers(originalUsers);
      }
    } else {
      console.log('Exclusão cancelada.'); // Log de debug
    }
  };

  // Função para alterar cargo (com UI Otimista)
  const handleRoleChange = async (userId: number, newRole: Role) => {
     // ... (função igual à anterior) ...
     const originalUsers = [...users];
     const userToUpdate = users.find(u => u.id === userId);
     if (!userToUpdate) return;
     setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user ));
     toast.info(`Atualizando cargo para ${newRole}...`);
     try {
       await updateUserRole(userId, newRole);
       toast.success(`Cargo do usuário ${userToUpdate.email} atualizado para ${newRole}!`);
     } catch (error: any) {
       console.error("Erro ao atualizar cargo:", error);
       toast.error(`Falha ao atualizar cargo. ${error.response?.data?.message || 'Erro desconhecido.'}`);
       setUsers(originalUsers);
     }
  };

  // Função auxiliar para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return <h1>Carregando usuários...</h1>;
  }

  return (
    <div className="admin-page">
      <h1>Painel de Administração - Usuários</h1>

      {users.length === 0 && !loading ? (
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name || '-'}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className="role-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  {/* --- BOTÃO AGORA SEM O 'disabled' --- */}
                  <button
                    className="action-button delete admin-delete-button"
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    // A linha 'disabled={user.role === 'ADMIN'}' FOI REMOVIDA
                    title={user.role === 'ADMIN' ? 'Não é possível deletar administradores' : 'Deletar este usuário'}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}