// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline } from '@mui/material';
import { SocketProvider } from './context/SocketContext'; // import et

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);
