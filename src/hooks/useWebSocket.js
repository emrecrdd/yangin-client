import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

export function useWebSocket() {
  const socket = useSocket();
  const [sensorUpdate, setSensorUpdate] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handler = (sensor) => setSensorUpdate(sensor);

    socket.on('sensorUpdate', handler);

    return () => {
      socket.off('sensorUpdate', handler);
    };
  }, [socket]);

  return sensorUpdate;
}
