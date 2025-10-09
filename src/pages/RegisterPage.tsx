import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { toast } from 'react-toastify';
import './Auth.css';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(name, email, password);
      toast.success('Usuário registrado com sucesso!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.errors[0]?.msg || error.response?.data?.message || 'Falha no registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-form">
        <h2>Crie sua Conta</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Crie uma senha (mín. 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <p>Já tem uma conta? <Link to="/login">Faça o login</Link></p>
      </div>
    </main>
  );
}