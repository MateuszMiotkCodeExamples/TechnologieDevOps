/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest', // Użycie presetu do obsługi TypeScript
    testEnvironment: 'node', // Środowisko uruchomieniowe testów
    testTimeout: 60000, // Zwiększenie limitu czasu do 60s (Testcontainers może potrzebować więcej czasu na start)
    roots: ['<rootDir>/src'], // Wskazanie katalogu z testami
};