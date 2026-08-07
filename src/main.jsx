import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { PhoneRevealProvider } from './components/lead/PhoneRevealProvider';
import { captureAttribution } from './lead/attribution';

// Рекламные метки снимаются до первого рендера: пользователь может уйти со
// страницы раньше, чем приложение смонтируется, а источник нужен уже тогда (ТЗ 5).
captureAttribution();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Форма показа номера общая для всех страниц: номер стоит и в шапке, и в
        блоке «Поддержка», и на страницах ЖК. */}
    <PhoneRevealProvider>
      <App />
    </PhoneRevealProvider>
  </StrictMode>,
);
