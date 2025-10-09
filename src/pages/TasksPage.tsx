import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Lembre-se que o ideal é importar no main.tsx

import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask, createTask } from '../services/api';
import type { Task, UpdateTaskData } from '../types/types';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import { EditTaskModal } from '../components/EditTaskModal';
import { toast } from 'react-toastify';

export function TasksPage() {
  // --- ESTADOS DO COMPONENTE ---
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- LÓGICA DE DADOS ---
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
      toast.error("Sua sessão pode ter expirado. Por favor, faça o login novamente.");
      auth?.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(auth?.isAuthenticated) {
      fetchTasks();
    }
  }, [auth?.isAuthenticated]);

  // --- MANIPULADORES DE EVENTOS (HANDLERS) ---
  const handleTaskAdded = async (title: string, description: string) => {
    try {
      await createTask(title, description);
      toast.success('Tarefa adicionada!');
      fetchTasks();
    } catch (error) {
      toast.error('Não foi possível adicionar a tarefa.');
    }
  };

  const handleUpdateTask = async (id: number, data: UpdateTaskData) => {
    try {
      await updateTask(id, data);
      toast.success('Tarefa atualizada!');
      fetchTasks();
    } catch (error) {
      toast.error("Falha ao atualizar a tarefa.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await deleteTask(id);
        toast.success('Tarefa deletada!');
        fetchTasks();
      } catch (error) {
        toast.error("Falha ao deletar a tarefa.");
      }
    }
  };

  const handleOpenEditModal = (task: Task) => setEditingTask(task);
  const handleCloseModal = () => setEditingTask(null);
  
  const handleSaveChanges = async (id: number, data: UpdateTaskData) => {
    await handleUpdateTask(id, data);
    handleCloseModal();
  };

  // --- LÓGICA DE RENDERIZAÇÃO ---
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="app-container">
      <header className="header">
        <h1>Minhas Tarefas</h1>
        <button onClick={auth?.logout} className="logout-button">Sair</button>
      </header>

      <details className="add-task-form" open>
        <summary>Adicionar Nova Tarefa</summary>
        <AddTaskForm onTaskAdded={handleTaskAdded} />
      </details>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar tarefa por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="task-list">
        {loading ? (
          <>
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
          </>
        ) : filteredTasks.length === 0 ? ( // Checa a lista FILTRADA
          <div className="empty-state">
            <h2>Nenhuma tarefa encontrada.</h2>
            <p>{searchTerm ? "Tente uma busca diferente." : "Seja o primeiro a adicionar uma nova tarefa acima!"}</p>
          </div>
        ) : (
          filteredTasks.map(task => ( // Usa a lista FILTRADA
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onEdit={handleOpenEditModal}
            />
          ))
        )}
      </div>

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onRequestClose={handleCloseModal}
          task={editingTask}
          onSave={handleSaveChanges}
        />
      )}
    </main>
  );
}