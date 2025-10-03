import axios from 'axios';
// A importação de TaskStatus foi removida desta linha
import type { UpdateTaskData } from '../types';

const api = axios.create({
  baseURL: 'https://task-manager-api-h99p.onrender.com',
});

// ... (o resto do arquivo continua exatamente igual) ...

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (title: string, description: string) => {
  const response = await api.post('/tasks', { title, description });
  return response.data;
};

export const updateTask = async (id: number, data: UpdateTaskData) => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;