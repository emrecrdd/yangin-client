import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import maplibregl from 'maplibre-gl';

const STATUS_COLORS = {
  active: 'success',
  warning: 'warning',
  pending: 'default',
  error: 'error',
};

const SensorDetailPanel = ({ open, onClose, sensor }) => {
  const [timeRange, setTimeRange] = useState('all');
  const mapRef = useRef(null);
  const miniMapContainerRef = useRef(null);

  useEffect(() => {
    if (!sensor || !open || !miniMapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    mapRef.current = new maplibregl.Map({
      container: miniMapContainerRef.current,
      style: 'https://api.maptiler.com/maps/basic/style.json?key=08QYrkwvptqD1B0ZNFvr',
      center: [sensor.longitude, sensor.latitude],
      zoom: 14,
      interactive: false,
    });

    new maplibregl.Marker()
      .setLngLat([sensor.longitude, sensor.latitude])
      .addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [sensor, open]);

  if (!sensor) return null;

  const fullChartData = sensor.history || [
    { time: '12:00', temperature: 26, humidity: 45, smoke: 0.5 },
    { time: '12:05', temperature: 27, humidity: 44, smoke: 0.6 },
    { time: '12:10', temperature: 28, humidity: 42, smoke: 0.8 },
  ];

  const chartData = timeRange === 'all' ? fullChartData : fullChartData; // Gerçek filtreleme eklenecek

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h6" noWrap>
          Sensör Detayları
        </Typography>
        <Tooltip title="Kapat">
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* İçerik */}
      <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
        {/* Temel Bilgiler */}
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" alignItems="center">
          <Chip label={`ID: ${sensor.id}`} variant="outlined" />
          <Chip label={`Durum: ${sensor.status}`} color={STATUS_COLORS[sensor.status] || 'default'} />
          {sensor.name && <Chip label={`İsim: ${sensor.name}`} />}
        </Stack>

        {/* Mini Harita */}
        <Box
          ref={miniMapContainerRef}
          sx={{ height: 180, borderRadius: 1, mb: 3 }}
        />

        {/* Zaman Aralığı */}
        <Stack direction="row" spacing={1} mb={2}>
          {['all', '1h', '6h', '24h'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeRange(range)}
            >
              {range === 'all' ? 'Tümü' : range}
            </Button>
          ))}
        </Stack>

        {/* Grafik */}
        <Typography variant="subtitle1" gutterBottom>Geçmiş Veriler</Typography>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="temperature" stroke="#f44336" name="Sıcaklık (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#2196f3" name="Nem (%)" />
              <Line type="monotone" dataKey="smoke" stroke="#9c27b0" name="Duman (ppm)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Grafik verisi mevcut değil.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Uyarılar */}
        <Typography variant="subtitle1" gutterBottom>Son Uyarılar</Typography>
        {sensor.alerts && sensor.alerts.length > 0 ? (
          <Box sx={{ maxHeight: 140, overflowY: 'auto' }}>
            {sensor.alerts.map((alert, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{ mb: 0.5, color: alert.severity === 'error' ? 'error.main' : 'text.primary' }}
              >
                • {alert.message} <i>({alert.time})</i>
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Uyarı bulunmamaktadır.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Açıklama */}
        <Typography variant="subtitle1" gutterBottom>Açıklama</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
          {sensor.description || 'Açıklama mevcut değil.'}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SensorDetailPanel;
