FROM alpine:latest
RUN apk add --no-cache openssl
WORKDIR /app
COPY a_content.txt .
# Polecenie pokazujące pliki i działające w tle
CMD ["sh", "-c", "echo '--- Usługa A (base) ---'; echo 'Pliki w /app:'; ls; sleep infinity"]
