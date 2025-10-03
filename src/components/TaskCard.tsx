import type { Task, UpdateTaskData } from '../types'; // CORREÇÃO: Importa de 'types.ts'

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, data: UpdateTaskData) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const { id, title, description, status } = task;

  return (
    <div className={`task-card status-border-${status}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <div className="card-footer">
        <div className={`status status-${status}`}>
          {status.replace('-', ' ')}
        </div>
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

export default TaskCard;