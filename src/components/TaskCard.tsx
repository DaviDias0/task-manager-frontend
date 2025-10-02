import type { TaskStatus } from '../types'; // Corrigido para buscar do novo arquivo de tipos

interface TaskCardProps {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  onUpdate: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

function TaskCard({ id, title, description, status, onUpdate, onDelete }: TaskCardProps) {
  return (
    <div className={`task-card status-border-${status}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <div className="card-footer">
        <div className={`status status-${status}`}>
          {status.replace('-', ' ')}
        </div>
        <div className="card-actions">
          {status !== 'done' && (
            <button onClick={() => onUpdate(id, 'done')} className="action-button complete">Concluir</button>
          )}
          <button onClick={() => onDelete(id)} className="action-button delete">Deletar</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;