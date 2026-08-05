import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { captureAttribution } from './lead/attribution';

// Рекламные метки снимаются до первого рендера: пользователь может уйти со
// страницы раньше, чем приложение смонтируется, а источник нужен уже тогда (ТЗ 5).
captureAttribution();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
