// src/components/EditTaskModal.tsx
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { Task } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  task: Task | null;
  onSave: (id: number, data: { title: string; description: string }) => void;
}

// Estilos customizados para o modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
  },
};

Modal.setAppElement('#root'); // Para acessibilidade

export function EditTaskModal({ isOpen, onRequestClose, task, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSave = () => {
    if (task) {
      onSave(task.id, { title, description });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Editar Tarefa Modal"
    >
      <h2>Editar Tarefa</h2>
      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={onRequestClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
}