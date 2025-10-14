// src/components/AddTaskForm.tsx

import { useState } from 'react';

interface AddTaskFormProps {
  onTaskAdded: (title: string, description: string, priority: string, dueDate: string) => void;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA'); // Valor padrão
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onTaskAdded(title, description, priority, dueDate);
    setTitle('');
    setDescription('');
    setPriority('MEDIA');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-content">
      <input
        type="text"
        placeholder="Ex: Estudar React Hooks"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Ex: Revisar os capítulos sobre useState e useEffect"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Prioridade</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Data de Vencimento</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
}