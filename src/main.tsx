import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import './styles/globals.css';
import i18next from './i18n';
import { I18nextProvider } from 'react-i18next';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <Suspense fallback="Loading...">
          <App />
        </Suspense>
      </I18nextProvider>
    </BrowserRouter>
  </StrictMode>,
);
