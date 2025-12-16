import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useRegisterSW } from 'virtual:pwa-register/react';

const SWTrigger = () => {
  useRegisterSW({
    onNeedRefresh() {
      if (confirm("New content available. Reload?")) {
        window.location.reload();
      }
    },
  });
  return null;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SWTrigger />
    <App />
  </React.StrictMode>
);