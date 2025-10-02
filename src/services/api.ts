import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// ESTA É A LINHA QUE PRECISA SER EXPORTADA CORRETAMENTE
export type TaskStatus = 'pending' | 'in-progress' | 'done';

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