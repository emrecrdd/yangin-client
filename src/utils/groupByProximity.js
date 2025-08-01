import haversine from 'haversine-distance';

// Ortalama koordinat hesaplama fonksiyonu
function getGroupCenter(group) {
  const latSum = group.reduce((sum, s) => sum + Number(s.latitude), 0);
  const lonSum = group.reduce((sum, s) => sum + Number(s.longitude), 0);
  return {
    latitude: latSum / group.length,
    longitude: lonSum / group.length,
  };
}

export function groupSensorsByDistance(sensors, thresholdKm = 10) {
  const groups = [];

  sensors.forEach(sensor => {
    let added = false;
    for (const group of groups) {
      const refSensor = group[0];
      const distance = haversine(
        { lat: sensor.latitude, lon: sensor.longitude },
        { lat: refSensor.latitude, lon: refSensor.longitude }
      ) / 1000; // metre → km

      if (distance <= thresholdKm) {
        group.push(sensor);
        added = true;
        break;
      }
    }
    if (!added) groups.push([sensor]);
  });

  // Her grubun merkezini hesapla
  const groupedWithCenters = groups.map(group => ({
    center: getGroupCenter(group),
    sensors: group,
  }));

  return groupedWithCenters;
}
