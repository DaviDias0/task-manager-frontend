// src/pages/LoginPage.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';
import { loginUser } from '../services/api';
// NOVO: Importamos o ToastContainer para que as mensagens possam ser renderizadas
import { ToastContainer } from 'react-toastify'; 

jest.mock('../services/api');

// Função auxiliar para renderizar o componente com todos os provedores
const renderComponent = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        {/* Adicionamos o ToastContainer aqui */}
        <ToastContainer />
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  it('should render the login form elements correctly', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should allow the user to type into the fields', async () => {
    const user = userEvent.setup();
    renderComponent();
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
    
    renderComponent();

    await user.type(screen.getByPlaceholderText(/seu e-mail/i), 'email@errado.com');
    await user.type(screen.getByPlaceholderText(/sua senha/i), 'senhaerrada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Agora, a mensagem de erro será renderizada e o teste a encontrará
    const errorMessage = await screen.findByText(/E-mail ou senha inválidos/i);
    expect(errorMessage).toBeInTheDocument();
  });
});