// src/types/types.ts

// NOVO: Definimos e exportamos o tipo Role aqui
export type Role = 'USER' | 'ADMIN';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  createdAt: string;
  // Usamos o tipo Role aqui também, se já não estiver
  priority?: 'BAIXA' | 'MEDIA' | 'ALTA'; // Mantendo priority como string literal por enquanto
  dueDate?: string | null;
  // Se você quiser usar o tipo Role aqui também, seria:
  // priority?: Priority; // Assumindo que Priority é 'BAIXA' | 'MEDIA' | 'ALTA'
};

// Se você tiver um tipo Priority separado, ele ficaria aqui:
// export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA';