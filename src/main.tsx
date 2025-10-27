// src/main.tsx (Usando createPortal)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createPortal } from 'react-dom'; // <-- 1. Importe createPortal
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
// import Modal from 'react-modal'; // Mantido comentado por enquanto
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
// import 'react-loading-skeleton/dist/skeleton.css'; // Mantido comentado

// Modal.setAppElement('#root'); // Mantido comentado

const rootElement = document.getElementById('root');
const toastContainerRoot = document.body; // <-- 2. Renderizar no body

if (rootElement && toastContainerRoot) { // Garante que ambos existem
  ReactDOM.createRoot(rootElement).render(
    // <React.StrictMode> // Mantido comentado
      <>
        {/* 3. Use createPortal para renderizar ToastContainer no body */}
        {createPortal(
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />,
          toastContainerRoot // O destino é document.body
        )}
        {/* BrowserRouter continua envolvendo o App */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </>
    // </React.StrictMode>
  );
} else {
  console.error("Elemento root ou body não encontrado no DOM!");
}