// components/panels/SensorDetailPanel.jsx
import React from 'react';
import { getStatusColor } from '../../utils/statusUtils'; // Durum renk fonksiyonu (sonra ekleriz)

const SensorDetailPanel = ({ sensor }) => {
  if (!sensor) return <div>Bir sensör seçin.</div>;

  return (
    <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, minWidth: 300 }}>
      <h2>Sensor Detayları</h2>
      <p><strong>ID:</strong> {sensor.id}</p>
      <p><strong>Konum:</strong> {sensor.latitude}, {sensor.longitude}</p>
      <p><strong>Sıcaklık:</strong> {sensor.temperature ?? '-' } °C</p>
      <p><strong>Duman:</strong> {sensor.smoke ?? '-'}</p>
      <p><strong>Nem:</strong> {sensor.humidity ?? '-' } %</p>
      <p>
        <strong>Durum:</strong> 
        <span style={{ 
          color: getStatusColor(sensor.status), 
          fontWeight: 'bold', 
          marginLeft: 5
        }}>
          {sensor.status}
        </span>
      </p>
      {sensor.updatedAt && <p><strong>Güncellendi:</strong> {new Date(sensor.updatedAt).toLocaleString()}</p>}
    </div>
  );
};

export default SensorDetailPanel;
