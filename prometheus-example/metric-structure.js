// Przykładowa metryka temperatury dla konkretnego serwera w centrum danych
const serverTemperatureMetric = {
  name: 'server_temperature_celsius', // Nazwa metryki
  value: 38.5,                         // Aktualna wartość metryki
  timestamp: Date.now(),               // Znacznik czasu pobrania metryki
  labels: {                            // Etykiety opisujące metrykę
    server_id: 'web-prod-01',
    rack_id: 'A-102',
    data_center: 'dc-warsaw-1'
  }
};

console.log(`Zebrano metrykę: ${serverTemperatureMetric.name} dla serwera ${serverTemperatureMetric.labels.server_id} o wartości ${serverTemperatureMetric.value}°C`); 