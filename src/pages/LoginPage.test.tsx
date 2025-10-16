// src/pages/LoginPage.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'; // Usamos MemoryRouter para testes
import App from '../App'; // Importamos o App principal
import { loginUser } from '../services/api';

jest.mock('../services/api');

describe('LoginPage', () => {
  // O render agora acontece dentro de cada teste para ser mais explícito

  it('should render the login form elements correctly', () => {
    render(<MemoryRouter><App /></MemoryRouter>); // Renderiza o App
    expect(screen.getByPlaceholderText(/seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should allow the user to type into the fields', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    const emailInput = screen.getByPlaceholderText(/seu e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/sua senha/i);
    await user.type(emailInput, 'davi@teste.com');
    await user.type(passwordInput, 'senha123');
    expect(emailInput).toHaveValue('davi@teste.com');
    expect(passwordInput).toHaveValue('senha123');
  });

  it('should display an error toast on login failure', async () => {
    const user = userEvent.setup();
    (loginUser as jest.Mock).mockRejectedValueOnce(new Error('Falha no login'));
    
    render(<MemoryRouter><App /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText(/seu e-mail/i), 'email@errado.com');
    await user.type(screen.getByPlaceholderText(/sua senha/i), 'senhaerrada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/E-mail ou senha inválidos/i)).toBeInTheDocument();
  });

  // Teste de Sucesso Corrigido
  it('should navigate to tasks page on successful login', async () => {
    const user = userEvent.setup();
    const fakeToken = 'fake-jwt-token';
    (loginUser as jest.Mock).mockResolvedValueOnce({ token: fakeToken });

    render(<MemoryRouter><App /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText(/seu e-mail/i), 'davi@correto.com');
    await user.type(screen.getByPlaceholderText(/sua senha/i), 'senhacorreta');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Assert: Verificamos se a navegação aconteceu esperando por um elemento da TasksPage
    const tasksHeading = await screen.findByRole('heading', { name: /minhas tarefas/i });
    expect(tasksHeading).toBeInTheDocument();
  });
});