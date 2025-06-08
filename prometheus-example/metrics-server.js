// Zapisz ten kod jako app.js w nowym katalogu, np. 'my-node-app'
// W tym katalogu wykonaj: npm init -y && npm install express prom-client

const express = require('express');
const client = require('prom-client');
const app = express();
const port = 8080; // Port, na którym będzie działać aplikacja Node.js

// Utwórz rejestr dla metryk
const register = new client.Registry();

// Zbierz domyślne metryki (informacje o procesie Node.js, GC, itp.)
client.collectDefaultMetrics({ register });

// Zdefiniuj własną metrykę typu Counter dla liczby żądań HTTP
const httpRequestCounter = new client.Counter({
  name: 'nodejs_app_http_requests_total',
  help: 'Total number of HTTP requests processed by the Node.js app',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Zdefiniuj własną metrykę typu Gauge dla liczby aktywnych użytkowników (symulacja)
const activeUsersGauge = new client.Gauge({
  name: 'nodejs_app_active_users',
  help: 'Number of simulated active users on the Node.js app',
  labelNames: ['app', 'instance'], // Dodajemy etykiety, jeśli ich wcześniej nie było
  registers: [register],
});
// W logice aplikacji:
// activeUsersGauge.labels('my-node-app', 'instance-123').set(Math.floor(Math.random() * 100));

// Nowy wskaźnik: użycie pamięci RSS przez proces Node.js
const memoryUsageGauge = new client.Gauge({
  name: 'nodejs_app_memory_rss_bytes',
  help: 'Memory usage (RSS - Resident Set Size) of the Node.js app in bytes.',
  labelNames: ['app', 'instance'],
  collect() {
    // Ta funkcja będzie wywoływana za każdym razem, gdy Prometheus odpytuje /metrics
    // Dynamicznie ustawia wartość wskaźnika na aktualne użycie pamięci RSS.
    this.labels('my-node-app', `instance-${process.pid}`).set(process.memoryUsage().rss);
  },
  registers: [register],
});

const requestDurationHistogram = new client.Histogram({
  name: 'nodejs_app_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds for the Node.js app',
  labelNames: ['method', 'route', 'status_code', 'app', 'instance'],
  // Definiujemy własne przedziały (buckets) w sekundach, dostosowane do oczekiwanych czasów odpowiedzi
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// W logice aplikacji (np. middleware Express.js) do pomiaru czasu trwania żądania:
app.use((req, res, next) => {
  const endTimer = requestDurationHistogram.startTimer({ // Rozpocznij pomiar czasu i przypisz etykiety
    method: req.method,
    route: req.path, // Użyj req.route.path dla bardziej stabilnych ścieżek w Express
    app: 'my-node-app',
    instance: `instance-${process.pid}`
  });

  res.on('finish', () => {
    endTimer({ status_code: res.statusCode.toString() }); // Zakończ pomiar i dodaj etykietę status_code
  });
  next();
});

// Middleware do inkrementacji licznika żądań
app.use((req, res, next) => {
  // Symulacja zakończenia obsługi żądania, aby poprawnie zarejestrować status_code
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode.toString()).inc();
  });
  next();
});

app.get('/', (req, res) => {
  // Symulacja zmiany liczby aktywnych użytkowników
  activeUsersGauge.set(Math.floor(Math.random() * 100));
  res.send('Witaj w aplikacji Node.js z metrykami Prometheus! Odwiedź /metrics');
});

app.get('/hello', (req, res) => {
  res.send('Strona Hello!');
});

// Endpoint /metrics udostępniający zebrane metryki
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex.toString());
  }
});

app.listen(port, () => {
  console.log(`Aplikacja Node.js z metrykami uruchomiona na http://localhost:${port}`);
  console.log(`Metryki dostępne pod adresem http://localhost:${port}/metrics`);
});

// Dodaj etykiety do rejestru, aby odróżnić tę instancję aplikacji
register.setDefaultLabels({
  app: 'my-node-app',
  instance: `instance-${process.pid}`
});
