import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { updateTaskStatus, deleteTask } from '../services/api';
import type { Task, TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import '../components/TaskCard.css';
import '../components/AddTaskForm.css';

export function TasksPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        auth?.logout();
        return;
      }
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      const response = await api.get('/tasks', config);
      setTasks(response.data);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
      auth?.logout(); // Se der erro (ex: token expirado), desloga
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => { fetchTasks(); };

  const handleUpdateTask = async (id: number, status: TaskStatus) => {
    // Lógica completa aqui
    try {
      await updateTaskStatus(id, status);
      fetchTasks();
    } catch (error) {
      alert("Falha ao atualizar a tarefa.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    // Lógica completa aqui
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        alert("Falha ao deletar a tarefa.");
      }
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
        {loading ? (
          <p>Carregando tarefas...</p>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description ?? ''}
              status={task.status}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
        {!loading && tasks.length === 0 && (
          <p>Nenhuma tarefa encontrada. Que tal adicionar uma?</p>
        )}
      </div>
    </div>
  );
}