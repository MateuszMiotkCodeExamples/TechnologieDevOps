# Etap bazowy ze wspólnymi zależnościami
FROM alpine:latest as base
RUN apk add --no-cache openssl
# Dodajmy plik dla weryfikacji
RUN echo "Jestem w etapie base" > /base.txt

# Etap dla usługi A, bazujący na 'base'
FROM base as service_a
WORKDIR /app_a
COPY plik_a.txt .
# Proste polecenie, aby kontener działał i pokazywał zawartość
CMD ["sh", "-c", "echo '--- Usługa A ---'; echo 'Pliki w /app_a:'; ls; echo 'Plik z bazy:'; cat /base.txt; echo 'Wersja OpenSSL:'; openssl version; sleep infinity"]

# Etap dla usługi B, bazujący na 'base'
FROM base as service_b
WORKDIR /app_b
COPY plik_b.txt .
# Proste polecenie, aby kontener działał i pokazywał zawartość
CMD ["sh", "-c", "echo '--- Usługa B ---'; echo 'Pliki w /app_b:'; ls; echo 'Plik z bazy:'; cat /base.txt; echo 'Wersja OpenSSL:'; openssl version; sleep infinity"]
