import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importa o hook do contexto
import { toast } from 'react-toastify'; // Mantém para toast.error
import { Link } from 'react-router-dom';
import './Auth.css'; // Importa o CSS para estilos

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pega a função 'login' do nosso CONTEXTO (useAuth)
  const { login } = useAuth(); // Não precisa mais importar 'loginUser' da API

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, preencha o email e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      // Chama a função 'login' do CONTEXTO. Ela faz tudo (API, set User, navigate)
      // E agora também vai mostrar o toast de sucesso (ver próxima correção)
      await login(email, password);
      // Não precisamos mais do toast.success aqui, será feito no context
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Email ou senha inválidos. Tente novamente.');
      setIsLoading(false); // Só define como false em caso de erro
    }
    // Não precisa de finally setIsLoading(false) aqui, pois o sucesso navega
  };

  // Mantive sua estrutura HTML, mas adicionei classes do Auth.css
  return (
    <main className="auth-container"> {/* Classe principal do Auth.css */}
      <div className="auth-card"> {/* Card centralizado do Auth.css */}
        <h2>Bem-vindo de volta!</h2>
        <p>Acesse sua conta.</p> {/* Adicionei um parágrafo */}
        <form onSubmit={handleSubmit} className="auth-form"> {/* Classe do Auth.css */}
          <div className="form-group-auth"> {/* Classe do Auth.css */}
            <label htmlFor="email">Email</label> {/* Adicionado label */}
            <input
              type="email"
              id="email" // Adicionado id para o label
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group-auth"> {/* Classe do Auth.css */}
            <label htmlFor="password">Senha</label> {/* Adicionado label */}
            <input
              type="password"
              id="password" // Adicionado id para o label
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}> {/* Classe do Auth.css */}
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="auth-footer"> {/* Classe do Auth.css */}
          <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
        </div>
      </div>
    </main>
  );
}