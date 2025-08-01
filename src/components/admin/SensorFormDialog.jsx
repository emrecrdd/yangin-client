// components/admin/SensorFormDialog.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Map, { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';

const MAP_STYLE_URL = import.meta.env.VITE_MAP_STYLE;

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'warning', label: 'Uyarı' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'resolved', label: 'Çözüldü' },
];

const SensorFormDialog = ({ open, onClose, onSubmit, sensor }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const formik = useFormik({
    initialValues: {
      latitude: sensor?.latitude || '',
      longitude: sensor?.longitude || '',
      status: sensor?.status || 'active',
    },
    validationSchema: Yup.object({
      latitude: Yup.number()
        .required('Enlem bilgisi zorunludur.')
        .min(-90, 'Enlem -90 ile 90 arasında olmalıdır.')
        .max(90, 'Enlem -90 ile 90 arasında olmalıdır.'),
      longitude: Yup.number()
        .required('Boylam bilgisi zorunludur.')
        .min(-180, 'Boylam -180 ile 180 arasında olmalıdır.')
        .max(180, 'Boylam -180 ile 180 arasında olmalıdır.'),
      status: Yup.string()
        .oneOf(['active', 'warning', 'pending', 'resolved'])
        .required('Durum seçilmelidir.'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.values.latitude && formik.values.longitude) {
      setMarkerPosition({
        lat: parseFloat(formik.values.latitude),
        lng: parseFloat(formik.values.longitude),
      });
    }
  }, [formik.values.latitude, formik.values.longitude]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {sensor ? 'Sensör Bilgilerini Güncelle' : 'Yeni Sensör Ekle'}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers sx={{ pt: 2 }}>
          {/* Konum Bilgileri */}
          <Typography variant="subtitle2" gutterBottom>
            Konum Bilgileri
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              size="small"
              label="Enlem (Latitude)"
              name="latitude"
              type="number"
              value={formik.values.latitude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.latitude && Boolean(formik.errors.latitude)}
              helperText={formik.touched.latitude && formik.errors.latitude}
            />
            <TextField
              fullWidth
              size="small"
              label="Boylam (Longitude)"
              name="longitude"
              type="number"
              value={formik.values.longitude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.longitude && Boolean(formik.errors.longitude)}
              helperText={formik.touched.longitude && formik.errors.longitude}
            />
          </Box>

          {/* Harita */}
          <Box height={300} mb={3} borderRadius={1} overflow="hidden">
            <Map
              mapLib={maplibregl}
              mapStyle={MAP_STYLE_URL}
              initialViewState={{
                latitude: markerPosition?.lat || 39.92,
                longitude: markerPosition?.lng || 32.85,
                zoom: 6,
              }}
              style={{ width: '100%', height: '100%' }}
              onClick={(e) => {
                const lat = e.lngLat.lat;
                const lng = e.lngLat.lng;
                formik.setFieldValue('latitude', lat);
                formik.setFieldValue('longitude', lng);
                setMarkerPosition({ lat, lng });
              }}
            >
              {markerPosition && (
                <Marker latitude={markerPosition.lat} longitude={markerPosition.lng} color="red" />
              )}
            </Map>
          </Box>

          {/* Durum */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Durum
            </Typography>
            <TextField
              fullWidth
              size="small"
              select
              name="status"
              label="Durum Seçiniz"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Ölçüm Verileri */}
          {sensor && (
            <>
              <Box mt={4} mb={1}>
                <Divider />
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Ölçüm Verileri (Salt Okunur)
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Sıcaklık (°C)"
                  value={sensor.temperature ?? '-'}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Duman"
                  value={sensor.smoke ?? '-'}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Nem (%)"
                  value={sensor.humidity ?? '-'}
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </>
          )}
        </DialogContent>

        {/* Butonlar */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined">
            İptal
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {sensor ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SensorFormDialog;
