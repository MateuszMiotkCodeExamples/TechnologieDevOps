# Używa obrazu zbudowanego dla usługi A (nazwanego 'service_a') jako bazy
FROM service_a
# Kontynuuje w WORKDIR /app ustawionym w obrazie bazowym
COPY b_content.txt .
# Polecenie pokazujące pliki (powinny być a_content.txt i b_content.txt)
CMD ["sh", "-c", "echo '--- Usługa B (zależna) ---'; echo 'Pliki w /app:'; ls; sleep infinity"]
