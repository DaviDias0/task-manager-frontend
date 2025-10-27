// src/services/api.ts (Completo com Funções de Posts)

import axios from 'axios';
import type { Task } from '../types/types'; // Mantenha a importação dos seus tipos
// Importe UserProfile também se a interface Post usar detalhes do autor
// (Já definida abaixo, mas se mover para types.ts, importe daqui)
// import type { UserProfile } from './api'; // Ou '../types/types'

// --- INTERFACE DE USUÁRIO (EXISTENTE) ---
export interface UserProfile {
  id: number;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  profileImageUrl: string | null; // <-- Inclui o campo da foto
  createdAt: string;
  updatedAt: string;
}

// --- INTERFACE DE POSTAGEM (NOVA) ---
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  // Inclui dados do autor que o backend retorna
  author: {
    id: number;
    name: string | null;
    email: string; // Ou remova se não for necessário na listagem
  };
}


// --- INSTÂNCIA AXIOS (EXISTENTE) ---
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// --- INTERCEPTOR (EXISTENTE) ---
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('API Interceptor: Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

// --- FUNÇÕES DE AUTENTICAÇÃO (EXISTENTES) ---
export const registerUser = (name: string, email: string, password: string) => {
  console.log('API: Chamando registerUser...');
  return api.post('/auth/register', { name, email, password });
};

export const apiLoginUser = async (email: string, password: string) => {
  console.log('API: Chamando apiLoginUser...');
  const response = await api.post<{ token: string }>('/auth/login', { email, password });
  console.log('API: apiLoginUser retornou sucesso:', response.status);
  return response.data; // Retorna { token }
};

export const getProfile = async (): Promise<UserProfile> => {
  console.log('API: Chamando getProfile...');
  try {
    const response = await api.get<UserProfile>('/auth/profile');
    console.log('API: getProfile retornou sucesso:', response.status);
    return response.data;
  } catch (error) {
    console.error('API: Erro ao chamar getProfile:', error);
    throw error;
  }
};

export const updateProfilePicture = async (formData: FormData): Promise<UserProfile> => {
  try {
    const response = await api.patch<UserProfile>('/auth/profile/picture', formData);
    return response.data;
  } catch (error) {
    console.error('API: Erro ao atualizar foto de perfil:', error);
    throw error;
  }
};


// --- FUNÇÕES DE TAREFAS (EXISTENTES) ---
export const getTasks = async (sortBy = 'createdAt', order = 'desc'): Promise<Task[]> => {
  console.log(`API: Chamando getTasks (sortBy=${sortBy}, order=${order})...`);
  try {
    const response = await api.get('/tasks', { params: { sortBy, order } });
    console.log('API: getTasks retornou sucesso:', response.status);
    return response.data;
  } catch (error) {
     console.error('API: Erro ao chamar getTasks:', error);
    throw error;
  }
};

export const createTask = async (title: string, description: string, priority: string, dueDate: string) => {
  console.log('API: Chamando createTask...');
  try {
    const response = await api.post('/tasks', { title, description, priority, dueDate: dueDate || null });
    console.log('API: createTask retornou sucesso:', response.status);
    return response.data;
  } catch(error) {
    console.error('API: Erro ao chamar createTask:', error);
    throw error;
  }
};

export const updateTask = async (id: number, data: Partial<Task>) => {
  console.log(`API: Chamando updateTask para ID: ${id}...`);
  try {
    const response = await api.put(`/tasks/${id}`, data);
    console.log(`API: updateTask retornou sucesso: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(`API: Erro ao chamar updateTask para ID: ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  console.log(`API: Chamando deleteTask para ID: ${id}...`);
  try {
    const response = await api.delete(`/tasks/${id}`);
    console.log(`API: deleteTask retornou sucesso: ${response.status}`);
    return response.data;
  } catch (error) {
     console.error(`API: Erro ao chamar deleteTask para ID: ${id}:`, error);
    throw error;
  }
};

// --- FUNÇÕES DE ADMIN (EXISTENTES) ---
export const getAllUsers = async (): Promise<UserProfile[]> => { // Adicionado tipo de retorno
  console.log('API: Chamando getAllUsers...');
  try {
    const response = await api.get<UserProfile[]>('/admin/users'); // Adicionado tipo de retorno
    console.log('API: getAllUsers retornou sucesso:', response.status);
    return response.data;
  } catch (error) {
    console.error('API: Erro ao chamar getAllUsers:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => { // Tipo de retorno void
  console.log(`API: Chamando deleteUser para ID: ${userId}...`);
  try {
    await api.delete(`/admin/users/${userId}`); // Não precisa guardar response.data para delete
    console.log(`API: deleteUser retornou sucesso: 204`); // Status 204 geralmente
  } catch (error) {
     console.error(`API: Erro ao chamar deleteUser para ID: ${userId}:`, error);
    throw error;
  }
};

export const updateUserRole = async (userId: number, role: 'USER' | 'ADMIN'): Promise<UserProfile> => { // Retorna UserProfile atualizado
  console.log(`API: Chamando updateUserRole para ID: ${userId}, Novo Role: ${role}...`);
  try {
    const response = await api.put<UserProfile>(`/admin/users/${userId}/role`, { role }); // Adicionado tipo
    console.log(`API: updateUserRole retornou sucesso: ${response.status}`);
    return response.data; // Retorna o usuário atualizado
  } catch (error) {
     console.error(`API: Erro ao chamar updateUserRole para ID: ${userId}:`, error);
    throw error;
  }
};

// --- FUNÇÕES DE POSTAGENS (ADICIONADAS) ---

/**
 * Busca todas as postagens.
 */
export const getPosts = async (): Promise<Post[]> => {
  try {
    console.log("API: Chamando getPosts...");
    const { data } = await api.get<Post[]>('/posts');
    console.log(`API: getPosts retornou ${data.length} posts.`);
    return data;
  } catch (error) {
    console.error("API: Erro ao buscar posts:", error);
    throw error;
  }
};

/**
 * Cria uma nova postagem.
 */
export const createPost = async (title: string, content: string): Promise<Post> => {
  try {
    console.log("API: Chamando createPost...");
    const { data } = await api.post<Post>('/posts', { title, content });
    console.log("API: createPost retornou sucesso:", data.id);
    return data;
  } catch (error) {
    console.error("API: Erro ao criar post:", error);
    throw error;
  }
};

/**
 * Deleta uma postagem pelo ID.
 */
export const deletePost = async (postId: number): Promise<void> => {
  try {
    console.log(`API: Chamando deletePost para ID: ${postId}...`);
    await api.delete(`/posts/${postId}`);
    console.log(`API: deletePost retornou sucesso para ID: ${postId}`);
  } catch (error) {
    console.error(`API: Erro ao deletar post ${postId}:`, error);
    throw error;
  }
};

/**
 * Atualiza uma postagem pelo ID.
 */
export const updatePost = async (postId: number, title: string, content: string): Promise<Post> => {
    try {
      console.log(`API: Chamando updatePost para ID: ${postId}...`);
      const { data } = await api.put<Post>(`/posts/${postId}`, { title, content });
      console.log(`API: updatePost retornou sucesso para ID: ${postId}`);
      return data;
    } catch (error) {
      console.error(`API: Erro ao atualizar post ${postId}:`, error);
      throw error;
    }
  };

// --- FIM DAS FUNÇÕES DE POSTAGENS ---