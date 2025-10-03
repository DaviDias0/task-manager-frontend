import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask } from '../services/api';
import type { Task, UpdateTaskData } from '../types';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import { EditTaskModal } from '../components/EditTaskModal';
import '../components/TaskCard.css';
import '../components/AddTaskForm.css';

export function TasksPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
      auth?.logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleTaskAdded = () => { fetchTasks(); };

  const handleUpdateTask = async (id: number, data: UpdateTaskData) => {
    try {
      await updateTask(id, data);
      fetchTasks();
    } catch (error) {
      alert("Falha ao atualizar a tarefa.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        alert("Falha ao deletar a tarefa.");
      }
    }
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveChanges = async (id: number, data: UpdateTaskData) => {
    try {
      await handleUpdateTask(id, data);
      handleCloseModal();
    } catch (error) {
      alert('Falha ao salvar as alterações.');
    }
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Minhas Tarefas</h1>
        <button onClick={auth?.logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Sair</button>
      </div>
      <AddTaskForm onTaskAdded={handleTaskAdded} />
      <div className="task-list">
        {loading ? ( <p>Carregando tarefas...</p> ) : (
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
        {!loading && tasks.length === 0 && ( <p>Nenhuma tarefa encontrada. Que tal adicionar uma?</p> )}
      </div>
      <EditTaskModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        task={editingTask}
        onSave={handleSaveChanges}
      />
    </div>
  );
}