// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
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
      // Atraso para a toast aparecer
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Falha no registro.');
      setIsLoading(false); // Apenas no erro
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crie sua Conta</h2>
        <p>Comece a organizar suas tarefas.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group-auth">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group-auth">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group-auth">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Crie uma senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Já tem uma conta? <Link to="/login">Faça o login</Link></p>
        </div>
      </div>
    </div>
  );
}