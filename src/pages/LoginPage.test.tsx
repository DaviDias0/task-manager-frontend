// src/pages/LoginPage.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // NOVO: Importamos o user-event
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginPage } from './LoginPage';

jest.mock('../services/api');

describe('LoginPage', () => {
  // Teste 1: Garante que os elementos são renderizados (já está passando)
  it('should render the login form elements correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  // NOVO TESTE 2: Garante que os campos são preenchidos corretamente
  it('should allow the user to type into the email and password fields', async () => {
    const user = userEvent.setup(); // Configura a instância do user-event
    
    // Arrange: Renderiza o componente
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Act: Encontra os campos e simula a digitação do usuário
    const emailInput = screen.getByPlaceholderText(/seu e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/sua senha/i);

    await user.type(emailInput, 'davi@teste.com');
    await user.type(passwordInput, 'senha123');

    // Assert: Verifica se os campos contêm os valores digitados
    expect(emailInput).toHaveValue('davi@teste.com');
    expect(passwordInput).toHaveValue('senha123');
  });
});