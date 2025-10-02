import { useState, useEffect } from 'react';
import './App.css';
import TaskCard from './components/TaskCard';
import './components/TaskCard.css'; // Caminho corrigido
import AddTaskForm from './components/AddTaskForm';
import './components/AddTaskForm.css';
import api, { updateTaskStatus, deleteTask } from './services/api';
import type { Task, TaskStatus } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Falha ao buscar tarefas:", error);
      alert("Não foi possível carregar as tarefas. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const handleUpdateTask = async (id: number, status: TaskStatus) => {
    try {
      await updateTaskStatus(id, status);
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

  return (
    <div className="app-container">
      <h1>Task Manager</h1>
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

export default App;