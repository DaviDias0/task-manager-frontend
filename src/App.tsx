import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Não precisamos mais importar App.css ou Auth.css aqui, pois tudo está em index.css

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TasksPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;