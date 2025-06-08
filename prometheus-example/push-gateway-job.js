// Scenariusz: Krótkotrwałe zadanie (np. skrypt przetwarzania danych),
// które wysyła swoje metryki do Push Gateway po zakończeniu.

async function runNightlyBatchJob() {
  const jobName = 'nightly_data_processing';
  const startTime = Date.now();
  let recordsProcessed = 0;
  let errorsEncountered = 0;

  console.log(`Rozpoczynam zadanie: ${jobName}`);

  // Symulacja przetwarzania danych
  for (let i = 0; i < 1000; i++) {
    await new Promise(resolve => setTimeout(resolve, 2)); // Symulacja pracy
    if (Math.random() < 0.01) {
      errorsEncountered++;
    }
    recordsProcessed++;
  }

  const durationSeconds = (Date.now() - startTime) / 1000;
  console.log(`Zadanie ${jobName} zakończone. Przetworzono: ${recordsProcessed}, Błędy: ${errorsEncountered}, Czas: ${durationSeconds.toFixed(2)}s`);

  // Przygotowanie metryk w formacie tekstowym Prometheus
  const metricsPayload = `
# TYPE job_last_duration_seconds gauge
# HELP job_last_duration_seconds Czas trwania ostatniego wykonania zadania.
job_last_duration_seconds{job="${jobName}"} ${durationSeconds.toFixed(2)}
# TYPE job_records_processed_total counter
# HELP job_records_processed_total Całkowita liczba przetworzonych rekordów przez zadanie.
job_records_processed_total{job="${jobName}"} ${recordsProcessed}
# TYPE job_errors_encountered_total counter
# HELP job_errors_encountered_total Całkowita liczba błędów napotkanych przez zadanie.
job_errors_encountered_total{job="${jobName}"} ${errorsEncountered}
# TYPE job_last_completion_timestamp_seconds gauge
# HELP job_last_completion_timestamp_seconds Znacznik czasu ostatniego pomyślnego ukończenia zadania.
job_last_completion_timestamp_seconds{job="${jobName}"} ${Math.floor(Date.now() / 1000)}
  `;

  const PUSHGATEWAY_URL = 'http://localhost:9091'; // Przykładowy adres Push Gateway
  const pushGatewayEndpoint = `${PUSHGATEWAY_URL}/metrics/job/${jobName}`;

  try {
    // W rzeczywistym scenariuszu użyj biblioteki do wysyłania żądań HTTP, np. fetch lub axios
    // const response = await fetch(pushGatewayEndpoint, {
    //   method: 'POST', // lub PUT
    //   headers: { 'Content-Type': 'text/plain' },
    //   body: metricsPayload.trim()
    // });
    // if (!response.ok) {
    //   console.error(`Błąd wysyłania metryk do Push Gateway: ${response.statusText}`);
    // } else {
    //   console.log(`Metryki dla zadania ${jobName} wysłane pomyślnie do Push Gateway.`);
    // }
    console.log(`\n--- Symulacja wysyłania metryk do ${pushGatewayEndpoint} ---`);
    console.log(metricsPayload.trim());
    console.log('--- Koniec symulacji ---');
  } catch (error) {
    console.error(`Błąd podczas wysyłania metryk: ${error.message}`);
  }
}

runNightlyBatchJob(); 