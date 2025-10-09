export type TaskStatus = 'pending' | 'in-progress' | 'done';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};