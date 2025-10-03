// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação
import { registerUser } from '../services/api'; // Importa a função da API

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Inicializa o hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(name, email, password);
      alert('Usuário registrado com sucesso! Faça o login.');
      navigate('/login'); // Redireciona para a página de login
    } catch (error: any) {
      console.error('Falha no registro:', error);
      alert('Falha no registro: ' + (error.response?.data?.message || error.message));
    }
  };

  // O JSX do formulário continua o mesmo
  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Registrar</h2>
        <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Crie uma senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
}