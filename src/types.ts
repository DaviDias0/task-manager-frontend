// src/types.ts
export type TaskStatus = 'pending' | 'in-progress' | 'done';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
};