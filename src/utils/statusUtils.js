// utils/statusUtils.js
export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'green';
    case 'warning': return 'red';
    case 'pending': return 'orange';
    case 'resolved': return 'gray';
    default: return 'black';
  }
};
