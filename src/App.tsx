import { Routes, Route } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './pages/Auth.css';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TasksPage } from './pages/TasksPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas: qualquer um pode acessar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Protegidas: só acessa se estiver logado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TasksPage />} />
          {/* Se tivéssemos outras páginas protegidas, elas entrariam aqui */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;