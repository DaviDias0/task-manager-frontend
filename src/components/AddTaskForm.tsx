import { useState } from 'react';
import { createTask } from '../services/api';

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      alert('O título é obrigatório!');
      return;
    }
    try {
      await createTask(title, description);
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (error) {
      console.error("Falha ao criar tarefa:", error);
      alert('Não foi possível adicionar a tarefa.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <h2>Adicionar Nova Tarefa</h2>
      <input
        type="text"
        placeholder="Título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}
export default AddTaskForm;