// src/components/TaskCard.tsx

import type { Task } from '../types/types';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const statusClass = {
    PENDENTE: 'status-pending',
    EM_ANDAMENTO: 'status-in_progress',
    CONCLUIDA: 'status-done',
  };

  const priorityClass = {
    BAIXA: 'priority-baixa',
    MEDIA: 'priority-media',
    ALTA: 'priority-alta',
  };

  return (
    <div className={`task-card status-border-${task.status.toLowerCase()}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className="task-meta">
        {task.priority && (
          <span className={`priority-pill ${priorityClass[task.priority]}`}>
            {task.priority}
          </span>
        )}
        {task.dueDate && (
          <span className="due-date">
            Vence em: {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="card-footer">
        <span className={`status ${statusClass[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        <div className="card-actions">
          <button className="action-button edit" onClick={() => onEdit(task)}>Editar</button>
          <button className="action-button delete" onClick={() => onDelete(task.id)}>Deletar</button>
        </div>
      </div>
    </div>
  );
}