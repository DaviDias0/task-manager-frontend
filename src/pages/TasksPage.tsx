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

// Simple icon components for the toggle button
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const ChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;

export function TasksPage() {
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(true); // State for toggle

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      const data = await getTasks(sortBy, order);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      if (auth?.logout) {
        toast.error("Your session might have expired. Please log in again.");
        auth.logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch tasks on mount and when sorting changes
  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchTasks();
    }
  }, [auth?.isAuthenticated, sortBy, order]); // Dependencies include sorting state

  // Handler functions
  const handleTaskAdded = async (title: string, description: string, priority: string, dueDate: string) => {
    try {
      await createTask(title, description, priority, dueDate);
      toast.success('Task added!');
      fetchTasks(); // Refetch to get the ID and confirm
    } catch (error) {
      toast.error('Could not add task.');
    }
  };

  // Optimistic delete handler
  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const originalTasks = [...tasks];
      setTasks(tasks.filter(task => task.id !== id));
      toast.info('Deleting task...'); // Changed from success to info for optimistic
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully!'); // Confirm on success
      } catch (error: any) {
        toast.error(`Failed to delete task. ${error.response?.data?.message || 'Unknown error.'}`);
        setTasks(originalTasks); // Revert on error
      }
    }
  };

    // Optimistic save handler (called by EditTaskModal)
  const handleSaveChanges = async (id: number, data: Partial<Task>) => {
    const originalTasks = [...tasks];
    // Explicitly cast the updated task to Task type for state consistency
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...data } as Task : task
    );
    setTasks(updatedTasks);
    handleCloseModal(); // Close modal immediately
    toast.info('Updating task...'); // Changed from success to info

    try {
      await updateTask(id, data);
      toast.success('Task updated successfully!'); // Confirm on success
    } catch (error: any) {
      toast.error(`Failed to save changes. ${error.response?.data?.message || 'Unknown error.'}`);
      setTasks(originalTasks); // Revert on error
    }
  };


  const handleOpenEditModal = (task: Task) => setEditingTask(task);
  const handleCloseModal = () => setEditingTask(null);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Container for the entire tasks page content
    <div className="tasks-page-container">

      {/* --- Refactored Add New Task Section with Toggle & Animation --- */}
      <div className="add-task-toggle-section">
        <button
          className="add-task-toggle-button"
          onClick={() => setIsAddTaskFormVisible(!isAddTaskFormVisible)}
        >
          <span>Adicionar Nova Tarefa</span>
          {isAddTaskFormVisible ? <ChevronUp /> : <ChevronDown />}
        </button>

        <AnimatePresence>
          {isAddTaskFormVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: '1.5rem' }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              style={{ overflow: 'hidden' }} // Crucial for height animation
              transition={{ duration: 0.3, ease: "easeInOut" }} // Smoother transition
            >
              {/* Extra wrapper ensures padding doesn't interfere with height animation */}
              <div className="add-task-form-content-wrapper">
                 <AddTaskForm onTaskAdded={handleTaskAdded} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ---------------------------------------------------------------- */}

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar tarefa por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sorting Controls */}
      <div className="sort-container">
        <div className="sort-options">
          <span>Ordenar por:</span>
          <button className={`sort-button ${sortBy === 'createdAt' ? 'active' : ''}`} onClick={() => setSortBy('createdAt')}>Criação</button>
          <button className={`sort-button ${sortBy === 'dueDate' ? 'active' : ''}`} onClick={() => setSortBy('dueDate')}>Vencimento</button>
          <button className={`sort-button ${sortBy === 'priority' ? 'active' : ''}`} onClick={() => setSortBy('priority')}>Prioridade</button>
        </div>
        <button className="sort-button order-button" onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
          {order === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {loading ? (
          // Skeleton loader during initial load
          <>
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
            <Skeleton height={120} style={{ marginBottom: '1rem', borderRadius: '8px' }} />
          </>
        ) : (
          // AnimatePresence handles enter/exit animations for tasks
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              // Empty state message
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0}}>
                <div className="empty-state">
                  <h2>Nenhuma tarefa encontrada.</h2>
                  <p>{searchTerm ? "Tente uma busca diferente." : "Seja o primeiro a adicionar uma nova tarefa acima!"}</p>
                </div>
              </motion.div>
            ) : (
              // Map through filtered tasks and render animated TaskCards
              filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout // Animates layout changes (e.g., when sorting)
                  initial={{ opacity: 0, y: 50, scale: 0.8 }} // Initial state (entering)
                  animate={{ opacity: 1, y: 0, scale: 1 }} // Animate to this state (entering)
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} // Animate to this state (exiting)
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} // Spring animation
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

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onRequestClose={handleCloseModal}
          task={editingTask}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
}