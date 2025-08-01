import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import SensorDetailPanel from '../components/admin/SensorDetailPanel';
import SensorFormDialog from '../components/admin/SensorFormDialog';
import ConfirmDeleteDialog from '../components/admin/ConfirmDeleteDialog';
import SensorTable from '../components/admin/SensorTable';

import {
  fetchSensors,
  createSensor,
  updateSensor,
  deleteSensor
} from '../services/apiClient';

const INITIAL_MAP_CENTER = [28.9784, 41.0082]; // İstanbul koordinatları

const AdminSensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [detailSensor, setDetailSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Yeni filtre durumları
  const [filterId, setFilterId] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
   const handleRowClick = (sensor) => {
    if (mapInstance.current && sensor.latitude && sensor.longitude) {
      mapInstance.current.easeTo({
        center: [sensor.longitude, sensor.latitude],
        zoom: 15,
        duration: 1000,
      });
    }
  };

  // Sensörleri backend'den yükle
  const loadSensors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSensors();
      setSensors(res.data);
    } catch (err) {
      setError('Sensörler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  // Filtre uygulama (ID ve Durum)
  useEffect(() => {
    let filtered = sensors;

    if (filterId.trim() !== '') {
      filtered = filtered.filter(sensor =>
        sensor.id.toString().includes(filterId.trim())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(sensor => sensor.status === filterStatus);
    }

    setFilteredSensors(filtered);
  }, [sensors, filterId, filterStatus]);

  // Tam ekran değişikliklerini dinle ve haritayı yeniden boyutlandırh
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.resize();
        }
      }, 100);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Haritayı başlat
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: import.meta.env.VITE_MAP_STYLE,
      center: INITIAL_MAP_CENTER,
      zoom: 11,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    mapInstance.current.on('load', () => {
      // 3D binalar katmanı
      mapInstance.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });

      // Sensör veri kaynağı ve cluster
      mapInstance.current.addSource('sensors', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster daireleri
      mapInstance.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sensors',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 25]
        }
      });

      // Cluster sayıları
      mapInstance.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'sensors',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Cluster dışındaki sensör noktaları
      mapInstance.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'sensors',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'active'],
            '#4caf50',
            ['==', ['get', 'status'], 'warning'],
            '#ff9800',
            ['==', ['get', 'status'], 'pending'],
            '#9e9e9e',
            '#2196f3'
          ],
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // Cluster tıklama: zoom yap
      mapInstance.current.on('click', 'clusters', (e) => {
        const features = mapInstance.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        mapInstance.current.getSource('sensors').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          mapInstance.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        });
      });

      // Tek sensör tıklama: form aç
      mapInstance.current.on('click', 'unclustered-point', (e) => {
        const features = e.features[0];
        const sensor = features.properties;
        const sensorData = {
          id: parseInt(sensor.id),
          latitude: parseFloat(features.geometry.coordinates[1]),
          longitude: parseFloat(features.geometry.coordinates[0]),
          status: sensor.status,
          name: sensor.name || '',
          temperature: sensor.temperature ? parseFloat(sensor.temperature) : undefined,
          smoke: sensor.smoke ? parseFloat(sensor.smoke) : undefined,
          humidity: sensor.humidity ? parseFloat(sensor.humidity) : undefined,
        };
        setSelectedSensor(sensorData);
        setFormOpen(true);
        mapInstance.current.easeTo({
          center: features.geometry.coordinates,
          zoom: 15
        });
      });

      // İmleç gösterimi
      const setCursor = (cursor) => {
        mapInstance.current.getCanvas().style.cursor = cursor;
      };

      mapInstance.current.on('mouseenter', 'clusters', () => setCursor('pointer'));
      mapInstance.current.on('mouseleave', 'clusters', () => setCursor(''));
      mapInstance.current.on('mouseenter', 'unclustered-point', () => setCursor('pointer'));
      mapInstance.current.on('mouseleave', 'unclustered-point', () => setCursor(''));
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Sensörleri GeoJSON formatına çevir, filtreli liste kullanılıyor
  const sensorsGeoJson = {
    type: 'FeatureCollection',
    features: filteredSensors
      .filter((s) => s.latitude && s.longitude)
      .map((sensor) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [sensor.longitude, sensor.latitude]
        },
        properties: {
          id: sensor.id,
          status: sensor.status,
          name: sensor.name,
          temperature: sensor.temperature,
          smoke: sensor.smoke,
          humidity: sensor.humidity
        }
      }))
  };

  // Sensörler veya filtreler değişince harita verisini güncelle
  useEffect(() => {
    if (mapInstance.current && mapInstance.current.getSource('sensors')) {
      mapInstance.current.getSource('sensors').setData(sensorsGeoJson);
    }
  }, [sensorsGeoJson]);

  // Tam ekran açma/kapatma
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Tam ekran hatası:', err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Yeni sensör ekleme
  const handleAddClick = () => {
    setSelectedSensor(null);
    setFormOpen(true);
  };

  // Sensör düzenleme
  const handleEditClick = (sensor) => {
    setSelectedSensor(sensor);
    setFormOpen(true);
    if (sensor.latitude && sensor.longitude) {
      mapInstance.current?.flyTo({
        center: [sensor.longitude, sensor.latitude],
        zoom: 15
      });
    }
  };

  // Silme onayı açma
  const handleDeleteClick = (sensor) => {
    setSensorToDelete(sensor);
    setDeleteOpen(true);
  };

  // Form submit işlemi (ekle/güncelle)
  const handleFormSubmit = async (data) => {
    try {
      if (selectedSensor) {
        await updateSensor(selectedSensor.id, data);
        setNotification({
          open: true,
          message: 'Sensör başarıyla güncellendi.',
          severity: 'success'
        });
      } else {
        await createSensor(data);
        setNotification({
          open: true,
          message: 'Yeni sensör başarıyla eklendi.',
          severity: 'success'
        });
      }
      setFormOpen(false);
      await loadSensors();
    } catch (error) {
      setNotification({
        open: true,
        message: 'İşlem başarısız oldu!',
        severity: 'error'
      });
    }
  };

  // Silme işlemi onayı
  const handleDeleteConfirm = async () => {
    try {
      if (sensorToDelete) {
        await deleteSensor(sensorToDelete.id);
        setNotification({
          open: true,
          message: 'Sensör başarıyla silindi.',
          severity: 'success'
        });
        setDeleteOpen(false);
        setSensorToDelete(null);
        await loadSensors();
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Silme işlemi başarısız oldu!',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Sensör Yönetimi
        </Typography>

        {/* Filtreleme Alanı */}
        <TextField
          label="Sensör ID Ara"
          variant="outlined"
          size="small"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          sx={{ width: 150 }}
        />

        <FormControl variant="outlined" size="small" sx={{ width: 150 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            label="Durum"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="active">Aktif</MenuItem>
            <MenuItem value="warning">Uyarı</MenuItem>
            <MenuItem value="pending">Beklemede</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Button variant="contained" onClick={handleAddClick} sx={{ mr: 1 }}>
            Yeni Sensör Ekle
          </Button>
          <IconButton
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Tam ekranı kapat' : 'Tam ekranı aç'}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={mapContainer}
        sx={{
          width: '100%',
          height: isFullscreen ? '100vh' : 450,
          borderRadius: 1,
          boxShadow: 1,
          mb: 4,
          transition: 'height 0.3s ease',
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : 'auto',
          left: isFullscreen ? 0 : 'auto',
          zIndex: isFullscreen ? 1300 : 'auto' // MUI Snackbar vb. ile çakışmasın
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

     {loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <CircularProgress />
  </Box>
) : (
  <SensorTable
    sensors={filteredSensors}
    onEdit={handleEditClick}
    onDelete={handleDeleteClick}
    onRowClick={(sensor) => {
      handleRowClick(sensor);   // Haritada sensöre zoom yap
      setDetailSensor(sensor);  // Sağdan detay panelini aç
    }}
  />
)}


      <SensorFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        sensor={selectedSensor}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
              <SensorDetailPanel
  open={!!detailSensor}
  sensor={detailSensor}
  onClose={() => setDetailSensor(null)}
/>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(n => ({ ...n, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >


        <Alert
          severity={notification.severity}
          onClose={() => setNotification(n => ({ ...n, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
    </Box>
  );
};

export default AdminSensorsPage;
