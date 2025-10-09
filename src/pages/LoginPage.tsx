import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/api';
import { toast } from 'react-toastify';
import './Auth.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.token && auth) {
        auth.login(response.token);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Falha no login.');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-form">
        <h2>Bem-vindo de volta!</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Entrar</button>
        </form>
        <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
      </div>
    </main>
  );
}