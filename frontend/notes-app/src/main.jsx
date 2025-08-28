import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Modal from 'react-modal';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

Modal.setAppElement(rootElement);

// Register the Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('ServiceWorker registration failed: ', registrationError);
      });
  });
}


