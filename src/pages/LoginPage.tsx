import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
      alert('Falha no login: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Não tem uma conta? <Link to="/register">Registre-se</Link>
        </p>
      </form>
    </div>
  );
}