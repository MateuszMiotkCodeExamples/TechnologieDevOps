const path = require("path");
const { createClient } = require("redis");
const { DockerComposeEnvironment, Wait } = require("testcontainers");

describe("DockerComposeEnvironment Test (JavaScript)", () => {
    let environment; // Zmienna na środowisko Compose
    let redisClient; // Zmienna na klienta Redis

    beforeAll(async () => {
        const composeFilePath = path.resolve(__dirname, "..", "compose-files");
        const composeFile = "docker-compose.yaml";

        console.log("[Compose Test] Uruchamianie środowiska Docker Compose...");
        try {
            environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
                // Przekaż zmienną środowiskową do interpolacji w compose.yml
                .withEnvironment({ API_MODE: "javascript-test" })
                // Aktywuj profil 'debug', aby uruchomić usługę 'debugger-svc'
                .withProfiles("debug")
                // Poczekaj, aż usługa redis-svc będzie gotowa (nasłuchuje na porcie)
                .withWaitStrategy("redis-svc", Wait.forListeningPorts())
                // Poczekaj, aż usługa api-svc wypisze log (pokazuje użycie log strategy)
                .withWaitStrategy("api-svc", Wait.forLogMessage(/API_MODE=javascript-test/i))
                // Poczekaj, aż usługa debugger-svc wypisze log
                .withWaitStrategy("debugger-svc", Wait.forLogMessage(/Debugger active/i))
                // Uruchom zdefiniowane usługi (oraz te z profilu 'debug')
                .up();
            console.log("[Compose Test] Środowisko Docker Compose uruchomione.");

            // Pobierz kontener Redis ze środowiska
            // Uwaga: Nazwa kontenera to zwykle {projekt}-{usługa}-1
            // Projekt domyślnie bierze nazwę z katalogu nadrzędnego compose-files
            // Można ustalić nazwę za pomocą `docker ps` lub ustawić `.withProjectName()`
            const projectName = path.basename(path.resolve(composeFilePath, "..")); // Przykładowe ustalenie nazwy
            const redisContainerName = `${projectName}-redis-svc-1`;
            const redisContainer = environment.getContainer(redisContainerName);

            const host = await redisContainer.getHost();
            const port = await redisContainer.getMappedPort(6379);
            const redisUrl = `redis://${host}:${port}`;

            console.log(`[Compose Test] Łączenie z Redis: ${redisUrl}`);
            redisClient = createClient({ url: redisUrl });
            redisClient.on('error', (err) => console.error('[Compose Test] Błąd klienta Redis:', err));
            await redisClient.connect();
            console.log("[Compose Test] Połączono z Redis.");

        } catch (error) {
            console.error("[Compose Test] Błąd podczas setup:", error);
            if (environment) { // Spróbuj posprzątać, jeśli środowisko częściowo wstało
                try { await environment.down(); } catch (downError) { console.error("Error during teardown after setup failure:", downError); }
            }
            throw error;
        }
    }, 180000); // Timeout 180s dla beforeAll

    afterAll(async () => {
        console.log("[Compose Test] Zamykanie środowiska Docker Compose...");
        if (redisClient?.isOpen) {
            await redisClient.disconnect();
        }
        if (environment) {
            // Zamknięcie środowiska (zatrzymuje i usuwa kontenery, sieci, woluminy)
            await environment.down({ timeout: 10000 });
        }
        console.log("[Compose Test] Środowisko Docker Compose zamknięte.");
    });

    // --- Testy ---

    it("powinien połączyć się z Redis (uruchomionym przez Compose) i zapisać/odczytać wartość", async () => {
        expect(redisClient.isOpen).toBe(true);
        const key = "compose-js-key";
        const value = "compose-js-value";
        await redisClient.set(key, value);
        const retrievedValue = await redisClient.get(key);
        expect(retrievedValue).toBe(value);
        console.log("[Compose Test] Test Redis wykonany pomyślnie.");
    });

    it("powinien uruchomić usługi api-svc i debugger-svc", async () => {
        // Sprawdzenie istnienia kontenerów (pośrednio przez brak błędu w getContainer)
        const projectName = path.basename(path.resolve(__dirname, "..", "compose-files", ".."));
        const apiContainer = environment.getContainer(`${projectName}-api-svc-1`);
        const debuggerContainer = environment.getContainer(`${projectName}-debugger-svc-1`);

        expect(apiContainer).toBeDefined();
        expect(debuggerContainer).toBeDefined();
        console.log("[Compose Test] Test istnienia kontenerów API i Debugger wykonany pomyślnie.");
        // Można by dodać sprawdzenie logów tych kontenerów, jak w przykładzie TS
    });
});
