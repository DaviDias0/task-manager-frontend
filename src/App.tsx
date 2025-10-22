// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { MainLayout } from './components/MainLayout'; // Layout principal que inclui a Sidebar
// A importação do ToastContainer e seu CSS foram REMOVIDAS daqui

// Importação global do Skeleton CSS (mantida aqui ou movida para main.tsx)
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  return (
    <AuthProvider>
      {/* O ToastContainer NÃO está mais aqui */}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}> {/* Layout aplicado a todas as rotas internas */}
            {/* Rotas para usuários comuns e admins */}
            <Route path="/" element={<TasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Rotas exclusivas para admins */}
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