// Przykład użycia (konceptualny) biblioteki klienckiej Prometheus w Node.js
// Zakładamy, że biblioteka 'prom-client' jest zainstalowana

const client = require('prom-client');

// Utwórz rejestr metryk (opcjonalnie, domyślny rejestr jest zwykle dostępny)
const register = new client.Registry();

// Zdefiniuj metrykę typu Counter
const httpRequestCounter = new client.Counter({
  name: 'myapp_http_requests_total',
  help: 'Total number of HTTP requests processed by myapp',
  labelNames: ['method', 'route', 'status_code'], // Definicja etykiet
  registers: [register] // Rejestracja w konkretnym rejestrze
});

// Zdefiniuj metrykę typu Gauge
const activeConnectionsGauge = new client.Gauge({
  name: 'myapp_active_connections',
  help: 'Number of active connections to myapp',
  registers: [register]
});

// Zdefiniuj metrykę typu Histogram do mierzenia czasu odpowiedzi
const requestDurationHistogram = new client.Histogram({
  name: 'myapp_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds for myapp',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Definicja koszyków (buckets) dla histogramu
  registers: [register]
});

// Symulacja obsługi żądania HTTP
function handleRequest(method, route) {
  const startTime = Date.now();
  let statusCode = 200;

  // Zwiększ licznik aktywnych połączeń
  activeConnectionsGauge.inc();

  // ... logika obsługi żądania ...
  console.log(`Processing ${method} request for ${route}`);
  if (route === '/error') {
    statusCode = 500;
  }
  // Symulacja czasu trwania
  const duration = (Math.random() * 1.5) + 0.1; // od 0.1s do 1.6s
  
  // Zarejestruj czas trwania żądania
  requestDurationHistogram.labels(method, route).observe(duration);
  
  // Zwiększ licznik żądań HTTP z odpowiednimi etykietami
  httpRequestCounter.labels(method, route, statusCode.toString()).inc();

  // Zmniejsz licznik aktywnych połączeń po zakończeniu
  activeConnectionsGauge.dec();
  
  console.log(`Request ${method} ${route} finished with status ${statusCode} in ${duration.toFixed(3)}s`);
}

// Symulacja kilku żądań
handleRequest('GET', '/api/users');
handleRequest('POST', '/api/submit');
handleRequest('GET', '/error');


// Aby udostępnić metryki (przykład z użyciem Express.js):
// const express = require('express');
// const app = express();
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', register.contentType);
//   res.end(await register.metrics());
// });
// app.listen(8080, () => console.log('Metrics server running on port 8080'));

// Aby zobaczyć zebrane metryki (bez serwera HTTP, tylko konsola)
async function printMetrics() {
    console.log("\n--- Zebrane Metryki ---");
    console.log(await register.metrics());
    console.log("----------------------");
}
printMetrics(); 