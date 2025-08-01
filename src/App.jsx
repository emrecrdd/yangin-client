import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './styles/theme';  // theme.js dosyasının yolu
import MainLayout from './components/layout/MainLayout';
import SensorsPage from './pages/SensorsPage';
import ReportsPage from './pages/ReportsPage';
import AlertsPage from './pages/AlertsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminSensorsPage from './pages/AdminSensorsPage';  // Admin sensör yönetimi sayfası

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sensors" element={<SensorsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="admin/sensors" element={<AdminSensorsPage />} />  {/* Yeni rota */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
