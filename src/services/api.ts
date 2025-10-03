import axios from 'axios';
import type { TaskStatus } from '../types';

const api = axios.create({
  baseURL: 'https://task-manager-api-h99p.onrender.com',
});

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const createTask = async (title: string, description: string) => {
  const response = await api.post('/tasks', { title, description });
  return response.data;
};

export const updateTaskStatus = async (id: number, status: TaskStatus) => {
  const response = await api.patch(`/tasks/${id}`, { status });
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;