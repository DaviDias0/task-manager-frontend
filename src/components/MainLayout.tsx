// src/components/MainLayout.tsx

import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
// Importamos o ToastContainer e seu CSS AQUI
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="content-area">
        <Outlet /> {/* As páginas (TasksPage, ProfilePage, AdminPage) serão renderizadas aqui */}
      </main>
      {/* O ToastContainer agora vive aqui, disponível para todas as páginas dentro do layout */}
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}