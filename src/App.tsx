// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage'; // NOVO: Importamos a página de admin
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute'; // NOVO: Importamos a rota de admin
import { MainLayout } from './components/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Protegidas por Login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Rotas para todos os usuários logados */}
            <Route path="/" element={<TasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Rotas exclusivas para ADMINS */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;