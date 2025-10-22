// src/pages/TasksPage.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { getTasks, createTask, deleteTask, updateTask } from '../services/api';
// Import the Task type
import type { Task } from '../types/types';

jest.mock('../services/api');

describe('TasksPage', () => {

  beforeEach(() => {
    localStorage.setItem('token', 'fake-test-token');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Test 1: Fetch and display
  it('should fetch and display tasks on initial render', async () => {
    // Arrange: Add 'updatedAt' to mock tasks
    const mockTasks: Task[] = [
      { id: 1, title: 'Primeira Tarefa', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'ALTA' },
      { id: 2, title: 'Segunda Tarefa', description: '', status: 'CONCLUIDA', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'BAIXA' },
    ];
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(await screen.findByText('Primeira Tarefa')).toBeInTheDocument();
    expect(await screen.findByText('Segunda Tarefa')).toBeInTheDocument();
  });

  // Test 2: Create task
  it('should allow a user to add a new task', async () => {
    const user = userEvent.setup();
    const newTaskTitle = 'Nova Tarefa Pelo Teste';
    (getTasks as jest.Mock).mockResolvedValueOnce([]);
    (createTask as jest.Mock).mockResolvedValueOnce({});
    // Arrange: Add 'updatedAt' to the new mock task
    const newTask: Task = { id: 3, title: newTaskTitle, description: 'Desc', status: 'PENDENTE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'MEDIA' };
    (getTasks as jest.Mock).mockResolvedValueOnce([newTask]);
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.type(screen.getByPlaceholderText(/ex: estudar react hooks/i), newTaskTitle);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    expect(await screen.findByText(newTaskTitle)).toBeInTheDocument();
  });

  // Test 3: Search tasks
  it('should filter tasks when user types in the search input', async () => {
    const user = userEvent.setup();
    // Arrange: Add 'updatedAt' to mock tasks
    const mockTasks: Task[] = [
      { id: 1, title: 'Aprender React', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'ALTA' },
      { id: 2, title: 'Estudar Jest', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'MEDIA' },
    ];
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(await screen.findByText('Aprender React')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/buscar tarefa por título/i);
    await user.type(searchInput, 'React');
    await waitFor(() => {
      expect(screen.getByText('Aprender React')).toBeInTheDocument();
      expect(screen.queryByText('Estudar Jest')).not.toBeInTheDocument();
    });
  });

  // Test 4: Delete task
  it('should remove a task from the list when user clicks delete', async () => {
    const user = userEvent.setup();
     // Arrange: Add 'updatedAt' to mock task
    const mockTasks: Task[] = [
      { id: 1, title: 'Tarefa para deletar', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'ALTA' },
    ];
    (getTasks as jest.Mock).mockResolvedValueOnce(mockTasks);
    (deleteTask as jest.Mock).mockResolvedValueOnce({});
    (getTasks as jest.Mock).mockResolvedValueOnce([]);
    render(<MemoryRouter><App /></MemoryRouter>);
    const deleteButton = await screen.findByRole('button', { name: /deletar/i });
    await user.click(deleteButton);
    await waitFor(() => {
      expect(screen.queryByText('Tarefa para deletar')).not.toBeInTheDocument();
    });
  });

  // Test 5: Edit task
  it('should allow a user to edit a task', async () => {
    const user = userEvent.setup();
    const originalTitle = 'Tarefa Original';
    const updatedTitle = 'Tarefa Editada com Sucesso';
    // Arrange: Add 'updatedAt' to mock tasks
    const mockTask: Task = { id: 1, title: originalTitle, description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), priority: 'MEDIA' };
    (getTasks as jest.Mock).mockResolvedValueOnce([mockTask]);
    (updateTask as jest.Mock).mockResolvedValueOnce({});
    const updatedMockTask = { ...mockTask, title: updatedTitle, updatedAt: new Date().toISOString() }; // Update updatedAt here too
    (getTasks as jest.Mock).mockResolvedValueOnce([updatedMockTask]);

    render(<MemoryRouter><App /></MemoryRouter>);
    expect(await screen.findByText(originalTitle)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /editar/i }));
    const titleInputInModal = screen.getByLabelText(/título/i);
    await user.clear(titleInputInModal);
    await user.type(titleInputInModal, updatedTitle);
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));
    expect(await screen.findByText(updatedTitle)).toBeInTheDocument();
    expect(screen.queryByText(originalTitle)).not.toBeInTheDocument();
  });
});