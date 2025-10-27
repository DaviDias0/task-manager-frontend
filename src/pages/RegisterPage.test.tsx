// src/pages/RegisterPage.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { registerUser } from '../services/api';

jest.mock('../services/api');

const renderRegisterPage = () => {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <App />
    </MemoryRouter>
  );
};

describe('RegisterPage', () => {
  // Teste 1: Renderização
  it('should render the registration form elements correctly', () => {
    renderRegisterPage();
    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/crie uma senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
  });

  // Teste 2: Digitação
  it('should allow the user to type into the form fields', async () => {
    const user = userEvent.setup();
    renderRegisterPage();
    await user.type(screen.getByPlaceholderText(/seu nome/i), 'Davi Dias');
    await user.type(screen.getByPlaceholderText(/seu e-mail/i), 'davi@teste.com');
    await user.type(screen.getByPlaceholderText(/crie uma senha/i), 'senhaforte123');
    expect(screen.getByPlaceholderText(/seu nome/i)).toHaveValue('Davi Dias');
    expect(screen.getByPlaceholderText(/seu e-mail/i)).toHaveValue('davi@teste.com');
    expect(screen.getByPlaceholderText(/crie uma senha/i)).toHaveValue('senhaforte123');
  });

  // Teste 3: Falha no Registro
  it('should display an error toast on registration failure', async () => {
    const user = userEvent.setup();
    (registerUser as jest.Mock).mockRejectedValueOnce(new Error('Erro ao registrar'));
    renderRegisterPage();
    await user.type(screen.getByPlaceholderText(/seu nome/i), 'Usuário Teste');
    await user.type(screen.getByPlaceholderText(/seu e-mail/i), 'email@falha.com');
    await user.type(screen.getByPlaceholderText(/crie uma senha/i), 'senha123');
    await user.click(screen.getByRole('button', { name: /registrar/i }));
    expect(await screen.findByText(/Falha no registro/i)).toBeInTheDocument();
  });

  // NOVO TESTE 4: Sucesso no Registro
  it('should display success toast and navigate to login page on successful registration', async () => {
    const user = userEvent.setup();
    // Arrange: Configuramos o mock para simular um sucesso na API
    (registerUser as jest.Mock).mockResolvedValueOnce({});
    
    renderRegisterPage();

    // Act: Simulamos o preenchimento e o clique
    await user.type(screen.getByPlaceholderText(/seu nome/i), 'Novo Usuário');
    await user.type(screen.getByPlaceholderText(/seu e-mail/i), 'novo@sucesso.com');
    await user.type(screen.getByPlaceholderText(/crie uma senha/i), 'senhacorreta');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    // Assert: Verificamos se a mensagem de sucesso apareceu
    expect(await screen.findByText(/Usuário registrado com sucesso!/i)).toBeInTheDocument();
    
    // Assert: Verificamos se fomos redirecionados para a página de login,
    // procurando por um elemento que só existe lá.
    expect(await screen.findByRole('heading', { name: /bem-vindo de volta!/i })).toBeInTheDocument();
  });
});
