// src/pages/TasksPage.tsx

import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask, createTask } from '../services/api';
import type { Task } from '../types/types';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import { EditTaskModal } from '../components/EditTaskModal';
import { toast } from 'react-toastify';

export function TasksPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (auth?.isAuthenticated) {
      fetchTasks();
    }
  }, [auth?.isAuthenticated]);

  const handleTaskAdded = async (title: string, description: string, priority: string, dueDate: string) => {
    try {
      await createTask(title, description, priority, dueDate);
      toast.success('Tarefa adicionada!');
      fetchTasks();
    } catch (error) {
      toast.error('Não foi possível adicionar a tarefa.');
    }
  };

  const handleUpdateTask = async (id: number, data: Partial<Task>) => {
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

  const handleSaveChanges = async (id: number, data: Partial<Task>) => {
    await handleUpdateTask(id, data);
    handleCloseModal();
  };

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
        ) : (
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="empty-state">
                  <h2>Nenhuma tarefa encontrada.</h2>
                  <p>{searchTerm ? "Tente uma busca diferente." : "Seja o primeiro a adicionar uma nova tarefa acima!"}</p>
                </div>
              </motion.div>
            ) : (
              filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                >
                  <TaskCard
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={handleOpenEditModal}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
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