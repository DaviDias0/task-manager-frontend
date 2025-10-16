import axios from 'axios';
import type { Task, Priority } from '../types/types'; // Importando Priority, se necessário em outros lugares

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- FUNÇÕES DE AUTENTICAÇÃO ---
export const registerUser = (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password });

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// --- FUNÇÕES DE TAREFAS ---

// FUNÇÃO ATUALIZADA AQUI
export const getTasks = async (sortBy = 'createdAt', order = 'desc'): Promise<Task[]> => {
  const response = await api.get('/tasks', {
    params: { sortBy, order }, // Envia os parâmetros na URL (ex: /tasks?sortBy=dueDate&order=asc)
  });
  return response.data;
};

export const createTask = async (title: string, description: string, priority: string, dueDate: string) => {
  const response = await api.post('/tasks', {
    title,
    description,
    priority,
    dueDate: dueDate || null,
  });
  return response.data;
};

export const updateTask = async (id: number, data: Partial<Task>) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};