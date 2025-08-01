// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Grow,
  Divider,
} from '@mui/material';
import {
  Sensors,
  Report,
  WarningAmber,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const theme = useTheme();
  const [clock, setClock] = useState(new Date());
  const [sensors, setSensors] = useState([]);
  const [alertsCount, setAlertsCount] = useState(52); // Sabit örnek, sonra backend ile bağla
  const [reportsCount, setReportsCount] = useState(23); // Sabit örnek, sonra backend ile bağla

  // Socket setup
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      console.log('Socket bağlandı:', socket.id);
    });

    socket.on('sensor_updated', (sensor) => {
      console.log('Sensor güncelleme geldi:', sensor);

      setSensors((prev) => {
        if (sensor.deleted) {
          // Silinen sensör varsa listeden çıkar
          return prev.filter((s) => s.id !== sensor.id);
        }

        // Güncellenen veya yeni sensör varsa listeye ekle/güncelle
        const exists = prev.find((s) => s.id === sensor.id);
        if (exists) {
          return prev.map((s) => (s.id === sensor.id ? sensor : s));
        } else {
          return [...prev, sensor];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Clock güncelleme
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // İlk sensörleri API'den çek
  useEffect(() => {
    axios.get(`${API_URL}/sensors`)
      .then(res => {
        setSensors(res.data);
      })
      .catch(err => {
        console.error('Sensörler alınamadı:', err);
      });
  }, []);

  // Toplam sensör sayısı
  const totalSensors = sensors.length;

  // Grafik için örnek ihbar verisi (statik)
  const chartData = {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [
      {
        label: 'İhbar Sayısı',
        data: [12, 19, 7, 15, 10, 5, 18],
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.1)',
        borderColor: theme.palette.primary.main,
        tension: 0.3,
      },
    ],
  };

  // Özet kartlar, sensör sayısı dinamik, diğerleri şimdilik sabit
  const summaryCards = [
    {
      title: 'Toplam Sensör',
      count: totalSensors,
      icon: <Sensors fontSize="large" />,
      color: theme.palette.info.main,
    },
    {
      title: 'İhbarlar',
      count: alertsCount,
      icon: <WarningAmber fontSize="large" />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Raporlar',
      count: reportsCount,
      icon: <Report fontSize="large" />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: `url(/background-map.jpg) center/cover no-repeat fixed`,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.05)',
      }}
    >
      {/* Hoşgeldiniz */}
      <Paper
        elevation={3}
        sx={{
          px: 4,
          py: 3,
          mb: 4,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Hoşgeldiniz, Yönetici 👋
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Sistem durumu kontrol panelinizdesiniz.
        </Typography>
        <Typography
          variant="h6"
          sx={{ mt: 2, fontStyle: 'italic', color: theme.palette.primary.main }}
        >
          {clock.toLocaleTimeString('tr-TR')}
        </Typography>
      </Paper>

      {/* Özet Kartlar */}
      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grow in timeout={600 + index * 200} key={card.title}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${card.color}33, ${card.color}99)`,
                  color: '#fff',
                  boxShadow: `0 4px 20px ${card.color}55`,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {card.title}
                  </Typography>
                  <Typography variant="h4">{card.count}</Typography>
                </Box>
                <Box sx={{ opacity: 0.7 }}>{card.icon}</Box>
              </Paper>
            </Grid>
          </Grow>
        ))}
      </Grid>

      {/* Grafik */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Haftalık İhbar Grafiği
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Line data={chartData} />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
