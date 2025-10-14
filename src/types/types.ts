export type TaskStatus = 'pending' | 'in-progress' | 'done';

// src/types/types.ts

// Apenas o tipo Task é necessário aqui
// src/types/types.ts

// src/types/types.ts

// NOVO: Criamos um tipo específico para Priority
export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  createdAt: string;
  // Agora usamos o novo tipo Priority
  priority?: Priority;
  dueDate?: string | null;
};
export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};