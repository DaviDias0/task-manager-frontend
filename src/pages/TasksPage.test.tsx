// src/pages/TasksPage.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
// NOVO: Importamos updateTask para poder controlá-lo
import { getTasks, createTask, deleteTask, updateTask } from '../services/api';
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

  // Teste 1: Busca e exibição
  it('should fetch and display tasks on initial render', async () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Primeira Tarefa', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), priority: 'ALTA' }];
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(await screen.findByText('Primeira Tarefa')).toBeInTheDocument();
  });

  // Teste 2: Criação de Tarefa
  it('should allow a user to add a new task', async () => {
    const user = userEvent.setup();
    const newTaskTitle = 'Nova Tarefa Pelo Teste';
    (getTasks as jest.Mock).mockResolvedValueOnce([]);
    (createTask as jest.Mock).mockResolvedValueOnce({});
    const newTask: Task = { id: 3, title: newTaskTitle, description: 'Desc', status: 'PENDENTE', createdAt: new Date().toISOString(), priority: 'MEDIA' };
    (getTasks as jest.Mock).mockResolvedValueOnce([newTask]);
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.type(screen.getByPlaceholderText(/ex: estudar react hooks/i), newTaskTitle);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    expect(await screen.findByText(newTaskTitle)).toBeInTheDocument();
  });

  // Teste 3: Busca de Tarefas
  it('should filter tasks when user types in the search input', async () => {
    const user = userEvent.setup();
    const mockTasks: Task[] = [
      { id: 1, title: 'Aprender React', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), priority: 'ALTA' },
      { id: 2, title: 'Estudar Jest', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), priority: 'MEDIA' },
    ];
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(await screen.findByText('Aprender React')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/buscar tarefa por título/i);
    await user.type(searchInput, 'React');
    await waitFor(() => {
      expect(screen.queryByText('Estudar Jest')).not.toBeInTheDocument();
    });
  });

  // Teste 4: Exclusão de Tarefa
  it('should remove a task from the list when user clicks delete', async () => {
    const user = userEvent.setup();
    const mockTasks: Task[] = [
      { id: 1, title: 'Tarefa para deletar', description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), priority: 'ALTA' },
    ];
    (getTasks as jest.Mock).mockResolvedValueOnce(mockTasks);
    (deleteTask as jest.Mock).mockResolvedValueOnce({});
    (getTasks as jest.Mock).mockResolvedValueOnce([]); // Após deletar, a lista fica vazia
    render(<MemoryRouter><App /></MemoryRouter>);
    const deleteButton = await screen.findByRole('button', { name: /deletar/i });
    await user.click(deleteButton);
    await waitFor(() => {
      expect(screen.queryByText('Tarefa para deletar')).not.toBeInTheDocument();
    });
  });

  // NOVO TESTE 5: Edição de Tarefa
  it('should allow a user to edit a task', async () => {
    const user = userEvent.setup();
    const originalTitle = 'Tarefa Original';
    const updatedTitle = 'Tarefa Editada com Sucesso';
    
    // Arrange:
    // 1. A busca inicial retorna a tarefa original.
    const mockTask: Task = { id: 1, title: originalTitle, description: '', status: 'PENDENTE', createdAt: new Date().toISOString(), priority: 'MEDIA' };
    (getTasks as jest.Mock).mockResolvedValueOnce([mockTask]);
    // 2. A API de atualização funciona sem problemas.
    (updateTask as jest.Mock).mockResolvedValueOnce({});
    // 3. A segunda busca de tarefas retorna a tarefa com o título atualizado.
    const updatedMockTask = { ...mockTask, title: updatedTitle };
    (getTasks as jest.Mock).mockResolvedValueOnce([updatedMockTask]);

    render(<MemoryRouter><App /></MemoryRouter>);

    // Espera a tarefa original aparecer
    expect(await screen.findByText(originalTitle)).toBeInTheDocument();

    // Act:
    // 1. Clica no botão "Editar"
    await user.click(screen.getByRole('button', { name: /editar/i }));
    
    // 2. Encontra o input do título no modal (que agora está aberto) e o edita
    // Usamos 'getByLabelText' que é ótimo para acessibilidade
    const titleInputInModal = screen.getByLabelText(/título/i);
    await user.clear(titleInputInModal); // Limpa o campo antes de digitar
    await user.type(titleInputInModal, updatedTitle);

    // 3. Clica no botão "Salvar Alterações" do modal
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));
    
    // Assert: Verificamos se a tarefa com o novo título apareceu na tela
    expect(await screen.findByText(updatedTitle)).toBeInTheDocument();
    // E garantimos que a tarefa com o título antigo desapareceu
    expect(screen.queryByText(originalTitle)).not.toBeInTheDocument();
  });
});