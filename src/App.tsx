import { Routes, Route } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './pages/Auth.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Privadas (Protegidas) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TasksPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;