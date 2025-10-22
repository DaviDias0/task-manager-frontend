// src/types/types.ts

// Defines the possible roles a user can have
export type Role = 'USER' | 'ADMIN';

// Defines the possible priorities a task can have
export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA';

// Defines the structure of a Task object
export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  createdAt: string;
  // Use the Priority type here for consistency
  priority?: Priority;
  dueDate?: string | null;
  updatedAt: string; // Ensure this is included if your API sends it
  // Add userId if needed for frontend logic, although API usually handles this
  // userId?: number;
};

// Defines the structure of User data received from the API (excluding password)
export interface UserProfile {
    id: number;
    name: string | null;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}