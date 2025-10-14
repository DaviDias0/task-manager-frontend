// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal'; // <-- 1. Importe o Modal

import './index.css';
import 'react-loading-skeleton/dist/skeleton.css';

// --- 2. ADICIONE ESTA LINHA ---
Modal.setAppElement('#root');
// ------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);