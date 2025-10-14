import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { Task, Priority } from '../types/types';

// Função auxiliar para formatar a data para o input (formato AAAA-MM-DD)
const formatDateForInput = (isoDate?: string | null) => {
  if (!isoDate) return '';
  // Garante que a data seja interpretada corretamente independente do fuso horário
  const date = new Date(isoDate);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset).toISOString().split('T')[0];
};

interface EditTaskModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  task: Task;
  onSave: (id: number, data: Partial<Task>) => void;
}

export function EditTaskModal({ isOpen, onRequestClose, task, onSave }: EditTaskModalProps) {
  // Estados internos do formulário
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<Task['status']>(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority || 'MEDIA');
  const [dueDate, setDueDate] = useState(formatDateForInput(task.dueDate));

  // Sincroniza o estado do formulário se a tarefa selecionada mudar
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority || 'MEDIA');
    setDueDate(formatDateForInput(task.dueDate));
  }, [task]);

  const handleSave = () => {
    onSave(task.id, {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      appElement={document.getElementById('root') as HTMLElement}
    >
      <h2>Editar Tarefa</h2>
      
      {/* Container principal do formulário com a estrutura correta */}
      <div className="edit-form-content">
        
        <div className="form-group">
          <label htmlFor="edit-title">Título</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-description">Descrição</label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edit-status">Status</label>
            <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDA">Concluída</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="edit-priority">Prioridade</label>
            <select id="edit-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-dueDate">Data de Vencimento</label>
          <input
            id="edit-dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-button modal-button-cancel" onClick={onRequestClose}>Cancelar</button>
          <button className="modal-button modal-button-save" onClick={handleSave}>Salvar Alterações</button>
        </div>
      </div>
    </Modal>
  );
}