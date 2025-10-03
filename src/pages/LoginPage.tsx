// src/pages/LoginPage.tsx
import { useState } from 'react';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Importa o hook de autenticação

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth(); // Usa o contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.token && auth) {
        auth.login(response.token); // Chama a função de login do contexto
      }
    } catch (error: any) {
      alert('Falha no login: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {/* O resto do formulário continua igual */}
        <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}