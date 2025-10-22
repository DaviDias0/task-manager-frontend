import axios from 'axios';
import type { Task } from '../types/types'; // Importando tipos

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// --- LOG NO INTERCEPTOR ---
api.interceptors.request.use(config => {
  console.log('API Interceptor: Verificando token...'); // Log 1
  const token = localStorage.getItem('token');
  if (token) {
    console.log('API Interceptor: Token encontrado, adicionando header.'); // Log 2
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('API Interceptor: Nenhum token encontrado.'); // Log 3
  }
  return config;
}, error => {
  console.error('API Interceptor: Erro no interceptor de requisição:', error); // Log 4 (Erro)
  return Promise.reject(error);
});

// --- FUNÇÕES DE AUTENTICAÇÃO ---
export const registerUser = (name: string, email: string, password: string) => {
  console.log('API: Chamando registerUser...'); // Log R1
  return api.post('/auth/register', { name, email, password });
};

export const loginUser = async (email: string, password: string) => {
  console.log('API: Chamando loginUser...'); // Log L1
  const response = await api.post('/auth/login', { email, password });
  console.log('API: loginUser retornou sucesso:', response.status); // Log L2
  return response.data;
};

// --- FUNÇÃO getProfile COM LOGS ---
export const getProfile = async () => {
  console.log('API: Chamando getProfile...'); // Log P1
  try {
    const response = await api.get('/auth/profile');
    console.log('API: getProfile retornou sucesso:', response.status); // Log P2
    return response.data;
  } catch (error) {
    console.error('API: Erro ao chamar getProfile:', error); // Log P3 (Erro)
    throw error; // Re-lança o erro para a página capturar
  }
};

// --- FUNÇÕES DE TAREFAS ---
export const getTasks = async (sortBy = 'createdAt', order = 'desc'): Promise<Task[]> => {
  console.log(`API: Chamando getTasks (sortBy=${sortBy}, order=${order})...`); // Log T1
  try {
    const response = await api.get('/tasks', {
      params: { sortBy, order },
    });
    console.log('API: getTasks retornou sucesso:', response.status); // Log T2
    return response.data;
  } catch (error) {
     console.error('API: Erro ao chamar getTasks:', error); // Log T3 (Erro)
    throw error;
  }
};

export const createTask = async (title: string, description: string, priority: string, dueDate: string) => {
  console.log('API: Chamando createTask...'); // Log C1
  try {
    const response = await api.post('/tasks', {
      title,
      description,
      priority,
      dueDate: dueDate || null,
    });
    console.log('API: createTask retornou sucesso:', response.status); // Log C2
    return response.data;
  } catch(error) {
    console.error('API: Erro ao chamar createTask:', error); // Log C3 (Erro)
    throw error;
  }
};

export const updateTask = async (id: number, data: Partial<Task>) => {
  console.log(`API: Chamando updateTask para ID: ${id}...`); // Log U1
  try {
    const response = await api.put(`/tasks/${id}`, data);
    console.log(`API: updateTask retornou sucesso: ${response.status}`); // Log U2
    return response.data;
  } catch (error) {
    console.error(`API: Erro ao chamar updateTask para ID: ${id}:`, error); // Log U3 (Erro)
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  console.log(`API: Chamando deleteTask para ID: ${id}...`); // Log D1
  try {
    const response = await api.delete(`/tasks/${id}`);
    console.log(`API: deleteTask retornou sucesso: ${response.status}`); // Log D2
    return response.data;
  } catch (error) {
     console.error(`API: Erro ao chamar deleteTask para ID: ${id}:`, error); // Log D3 (Erro)
    throw error;
  }
};

// --- FUNÇÕES DE ADMIN ---
export const getAllUsers = async () => {
  console.log('API: Chamando getAllUsers...'); // Log A1
  try {
    const response = await api.get('/admin/users');
    console.log('API: getAllUsers retornou sucesso:', response.status); // Log A2
    return response.data;
  } catch (error) {
    console.error('API: Erro ao chamar getAllUsers:', error); // Log A3 (Erro)
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  console.log(`API: Chamando deleteUser para ID: ${userId}...`); // Log AD1
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    console.log(`API: deleteUser retornou sucesso: ${response.status}`); // Log AD2
    return response.data;
  } catch (error) {
     console.error(`API: Erro ao chamar deleteUser para ID: ${userId}:`, error); // Log AD3 (Erro)
    throw error;
  }
};

export const updateUserRole = async (userId: number, role: 'USER' | 'ADMIN') => {
  console.log(`API: Chamando updateUserRole para ID: ${userId}, Novo Role: ${role}...`); // Log UR1
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role }); // Envia o novo cargo no corpo
    console.log(`API: updateUserRole retornou sucesso: ${response.status}`); // Log UR2
    return response.data; // Retorna o usuário atualizado
  } catch (error) {
     console.error(`API: Erro ao chamar updateUserRole para ID: ${userId}:`, error); // Log UR3 (Erro)
    throw error;
  }
};

// Adicione aqui a função updateUserRole se/quando a criarmos
// export const updateUserRole = async (userId: number, role: string) => { ... };