import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const SharedMap = ({ children, center = [39.9334, 32.8597], zoom = 6 }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) return;

    const initializedMap = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center,
      zoom,
    });

    initializedMap.addControl(new maplibregl.NavigationControl(), 'top-right');

    setMap(initializedMap);

    return () => initializedMap.remove();
  }, [map]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {map &&
        React.Children.map(children, (child) =>
          React.cloneElement(child, { map })
        )}
    </div>
  );
};

export default SharedMap;
