import React, { useState } from 'react';
import Map from 'react-map-gl';
import { Marker, NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const getColorByStatus = (status) => {
  switch (status) {
    case 'active': return '#4CAF50';
    case 'warning': return '#F44336';
    case 'pending': return '#FF9800';
    case 'resolved': return '#9E9E9E';
    default: return '#2196F3';
  }
};

const SensorMap = ({ sensors = [], onSelectSensor = () => {} }) => {
  const [viewport, setViewport] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
    zoom: 10
  });

  const maptilerApiKey = import.meta.env.VITE_MAPTILER_KEY;

  if (!maptilerApiKey) {
    console.error('Maptiler API key bulunamadı!');
    return <div style={{ color: 'red' }}>Harita yüklenemedi: API key eksik</div>;
  }

  return (
    <Map
      mapLib={maplibregl}
      initialViewState={viewport}
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${maptilerApiKey}`}
      onMove={evt => setViewport(evt.viewState)}
      attributionControl={false}
    >
      <div style={{
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: 'white',
        padding: '2px 5px',
        borderRadius: 3,
        fontSize: 10,
        zIndex: 1
      }}>
        <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer">© MapTiler</a> | 
        <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>
      </div>

      <NavigationControl position="top-left" showCompass={false} />

      {sensors.map(sensor => {
        const count = sensor.sensorsInGroup?.length || 1;
        return (
          <Marker
            key={sensor.id}
            longitude={Number(sensor.longitude)}
            latitude={Number(sensor.latitude)}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              onSelectSensor(sensor);
            }}
          >
            <div
              style={{
                width: count > 1 ? 28 : 24,
                height: count > 1 ? 28 : 24,
                borderRadius: '50%',
                backgroundColor: getColorByStatus(sensor.status),
                border: '3px solid white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: count > 1 ? 11 : 10,
                transition: 'all 0.2s'
              }}
              title={`${sensor.id} - Durum: ${sensor.status}`}
            >
              {count > 1 ? count : ''}
            </div>
          </Marker>
        );
      })}
    </Map>
  );
};

export default SensorMap;