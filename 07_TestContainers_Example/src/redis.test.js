// redis.test.js
const { createClient } = require('redis');
const { GenericContainer, Wait } = require('testcontainers');

describe('Redis Integration Test', () => {
    let container;
    let redisClient;

    beforeAll(async () => {
        console.log('Uruchamianie kontenera Redis...');
        container = await new GenericContainer('redis:7-alpine')
            .withExposedPorts(6379)
            .withWaitStrategy(Wait.forLogMessage(/Ready to accept connections/i))
            .start();
        console.log('Kontener Redis uruchomiony.');

        const redisUrl = `redis://${container.getHost()}:${container.getMappedPort(6379)}`;
        console.log(`Łączenie z Redis pod adresem: ${redisUrl}`);
        redisClient = createClient({ url: redisUrl });
        redisClient.on('error', err => console.error('Błąd klienta Redis:', err));

        await redisClient.connect();
        console.log('Połączono z Redis.');
    }, 90_000);

    afterAll(async () => {
        console.log('Rozłączanie klienta Redis...');
        if (redisClient && redisClient.isOpen) {
            await redisClient.disconnect();
        }
        console.log('Zatrzymywanie kontenera Redis...');
        if (container) {
            await container.stop();
        }
        console.log('Kontener Redis zatrzymany.');
    });

    it('powinien poprawnie zapisać i odczytać wartość z Redis', async () => {
        const key = 'test-key-123';
        const value = `test-value-${Date.now()}`;

        console.log(`Zapisywanie klucza: ${key} o wartości: ${value}`);
        await redisClient.set(key, value);

        console.log(`Odczytywanie klucza: ${key}`);
        const retrievedValue = await redisClient.get(key);

        expect(retrievedValue).toBe(value);
        console.log('Zapis i odczyt zakończone sukcesem.');
    });
});