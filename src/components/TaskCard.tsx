import type { Task, UpdateTaskData } from '../types/types';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, data: UpdateTaskData) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const { id, title, description, status } = task;

  return (
    <div className={`task-card status-border-${status}`}>
      <div className="task-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="card-footer">
        <span className={`status status-${status}`}>{status}</span>
        <div className="card-actions">
          <button onClick={() => onEdit(task)} className="action-button edit">Editar</button>
          {status !== 'done' && (
            <button onClick={() => onUpdate(id, { status: 'done' })} className="action-button complete">Concluir</button>
          )}
          <button onClick={() => onDelete(id)} className="action-button delete">Deletar</button>
        </div>
      </div>
    </div>
  );
}