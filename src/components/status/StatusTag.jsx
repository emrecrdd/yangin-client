// components/status/StatusTag.jsx
import { translateStatus, getStatusColor } from '../../utils/statusUtils';

export default function StatusTag({ status }) {
  const color = getStatusColor(status);
  return (
    <span style={{
      backgroundColor: color,
      padding: '2px 8px',
      borderRadius: '10px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.85em'
    }}>
      {translateStatus(status)}
    </span>
  );
}
