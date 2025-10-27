// src/App.tsx (Versão Limpa)
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { MainLayout } from './components/MainLayout';
// Removida a importação do 'toast' que era só para o botão
import 'react-loading-skeleton/dist/skeleton.css';
import { PostsPage } from './pages/PostsPage'; // <-- Importa a nova página

function App() {
  return (
    <AuthProvider>
      {/* ... botão de teste (pode remover) ... */}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<TasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/posts" element={<PostsPage />} /> {/* <-- ADICIONE A ROTA AQUI */}

            {/* Rotas de Admin */}
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