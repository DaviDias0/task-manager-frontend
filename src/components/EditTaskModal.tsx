import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { Task, UpdateTaskData } from '../types/types';

interface EditTaskModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  task: Task;
  onSave: (id: number, data: UpdateTaskData) => void;
}

// Estilos profissionais para o Modal
const customStyles = {
  overlay: { 
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  content: {
    top: '50%', 
    left: '50%', 
    right: 'auto', 
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    background: '#1F2937', // Usa a cor de superfície do seu tema
    border: '1px solid #4B5563', // Cor da borda
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    padding: '2rem',
    color: '#F9FAFB', // Cor do texto primário
    inset: '50% auto auto 50%', /* Garante o posicionamento central */
  },
};

Modal.setAppElement('#root');

export function EditTaskModal({ isOpen, onRequestClose, task, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task.id, { title, description });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      style={customStyles} 
      contentLabel="Editar Tarefa"
    >
      <h2 style={{ 
        marginTop: 0, 
        color: 'var(--text-primary)', /* Usa a variável de cor */
        textAlign: 'center',
        fontSize: '1.5rem', /* Um pouco maior */
        marginBottom: '1.5rem' /* Espaçamento */
      }}>
        Editar Tarefa
      </h2>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ /* Estilos diretamente no elemento para simplicidade no modal */
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows={4} 
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
          {/* --- BOTÕES CORRIGIDOS --- */}
          <button 
            type="button" 
            onClick={onRequestClose} 
            style={{ 
              backgroundColor: 'var(--surface-2)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s ease',
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            style={{ 
              backgroundColor: 'var(--accent-blue)', 
              color: 'white', 
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s ease',
            }}
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </Modal>
  );
}