import { useState, useEffect } from 'react';
// NOVO: Importar o Skeleton e o CSS dele (lembre-se de adicionar o CSS no seu main.tsx ou App.tsx)
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask, createTask } from '../services/api';
import type { Task, UpdateTaskData } from '../types/types';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import { EditTaskModal } from '../components/EditTaskModal';
import { toast } from 'react-toastify';

export function TasksPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  // O nome do estado foi mantido como 'loading' para aproveitar sua lógica existente
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      // Não é mais necessário setar o loading aqui, pois o estado inicial já é 'true'
      // setLoading(true); 
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

  // ... (o restante das suas funções handleTaskAdded, handleUpdateTask, etc. continua igual)
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

      <div className="task-list">
        {/* NOVO: Lógica do Skeleton Screen */}
        {loading ? (
          // Enquanto 'loading' for true, exibe 3 "esqueletos" de tarefas
          <>
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
          </>
        ) : tasks.length === 0 ? (
          // Se não estiver carregando e não houver tarefas, exibe o estado de vazio
          <div className="empty-state">
            <h2>Nenhuma tarefa encontrada.</h2>
            <p>Seja o primeiro a adicionar uma nova tarefa acima!</p>
          </div>
        ) : (
          // Se não estiver carregando e houver tarefas, exibe a lista
          tasks.map(task => (
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