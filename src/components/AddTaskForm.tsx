import { useState } from 'react';
import { toast } from 'react-toastify';

interface AddTaskFormProps {
  onTaskAdded: (title: string, description: string) => void;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('O título da tarefa é obrigatório!');
      return;
    }
    
    // Chama a função do componente pai, passando os dados do formulário
    onTaskAdded(title, description);
    
    // Limpa o formulário após o envio
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form-fields">
      <input
        type="text"
        placeholder="Ex: Estudar React Hooks"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Ex: Revisar os capítulos sobre useState e useEffect"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <button type="submit">Adicionar Tarefa</button>
    </form>
  );
}