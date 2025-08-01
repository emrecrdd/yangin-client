import React, { useEffect, useState } from 'react';
import { fetchSensors } from '../services/apiClient';
import SensorMap from '../components/map/SensorMap';
import SensorDetailPanel from '../components/panel/SensorDetailPanel';
import { groupSensorsByDistance } from '../utils/groupByProximity';
import { useWebSocket } from '../hooks/useWebSocket';

const statusColors = {
  active: 'green',
  warning: 'red',
  pending: 'orange',
  resolved: 'gray',
};

const SensorsPage = () => {
  const [sensors, setSensors] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    tempMin: '',
    tempMax: '',
    smokeMin: '',
    smokeMax: '',
    humidityMin: '',
    humidityMax: '',
  });
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sensorUpdate = useWebSocket();

  useEffect(() => {
    fetchSensors()
      .then(res => {
        setSensors(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Sensör verisi alınamadı.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!sensorUpdate) return;

    setSensors(prevSensors => {
      const idx = prevSensors.findIndex(s => s.id === sensorUpdate.id);
      if (idx === -1) return prevSensors;
      const newSensors = [...prevSensors];
      newSensors[idx] = { ...newSensors[idx], ...sensorUpdate };
      return newSensors;
    });

    setSelectedSensor(prev => {
      if (prev?.id === sensorUpdate.id) {
        return { ...prev, ...sensorUpdate };
      }
      return prev;
    });
  }, [sensorUpdate]);

  const filteredSensors = sensors.filter(sensor => {
    if (filters.status !== 'all' && sensor.status !== filters.status) return false;
    if (filters.search && !sensor.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.tempMin && sensor.temperature < Number(filters.tempMin)) return false;
    if (filters.tempMax && sensor.temperature > Number(filters.tempMax)) return false;
    if (filters.smokeMin && sensor.smoke < Number(filters.smokeMin)) return false;
    if (filters.smokeMax && sensor.smoke > Number(filters.smokeMax)) return false;
    if (filters.humidityMin && sensor.humidity < Number(filters.humidityMin)) return false;
    if (filters.humidityMax && sensor.humidity > Number(filters.humidityMax)) return false;
    return true;
  });

  const sensorGroups = groupSensorsByDistance(filteredSensors, 10);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', height: '90vh', gap: 20 }}>
      <aside style={{ width: 300, padding: 20, borderRight: '1px solid #ddd' }}>
        {/* Filtre kontrolleri buraya */}
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 2 }}>
          <SensorMap sensors={filteredSensors} onSelectSensor={setSelectedSensor} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
          <h2>Filtrelenmiş Sensör Listesi ({filteredSensors.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Sıcaklık (°C)</th>
                <th>Duman</th>
                <th>Nem (%)</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map(sensor => (
                <tr
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor)}
                  style={{
                    backgroundColor: selectedSensor?.id === sensor.id ? '#f0f0f0' : 'white',
                    cursor: 'pointer',
                    color: statusColors[sensor.status],
                  }}
                >
                  <td>{sensor.id}</td>
                  <td>{sensor.latitude}</td>
                  <td>{sensor.longitude}</td>
                  <td>{sensor.temperature ?? '-'}</td>
                  <td>{sensor.smoke ?? '-'}</td>
                  <td>{sensor.humidity ?? '-'}</td>
                  <td>{sensor.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <aside style={{ width: 350, padding: 20, borderLeft: '1px solid #ddd' }}>
        <SensorDetailPanel sensor={selectedSensor} />
      </aside>
    </div>
  );
};

export default SensorsPage;
