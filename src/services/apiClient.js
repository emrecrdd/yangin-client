import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // .env ile esnek yapı
  timeout: 5000,
});

// Sensörleri getir
export const fetchSensors = () => api.get('/sensors');

// Tek sensör getir
export const fetchSensorById = (id) => api.get(`/sensors/${id}`);

// Sensör oluştur
export const createSensor = (sensorData) => api.post('/sensors', sensorData);

// Sensör güncelle
export const updateSensor = (id, sensorData) => api.put(`/sensors/${id}`, sensorData);

// Sensör sil
export const deleteSensor = (id) => api.delete(`/sensors/${id}`);

export default api;
