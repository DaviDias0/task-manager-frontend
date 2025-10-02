// src/services/api.ts
import axios from 'axios';
import type { TaskStatus } from '../types'; // Importa o TIPO

const api = axios.create({
  baseURL: 'https://task-manager-api-h99p.onrender.com',
});

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