# syntax=docker/dockerfile:1
FROM alpine:latest
RUN apk add --no-cache curl

# Upewnij się, że sekret jest poprawnie montowany
RUN --mount=type=secret,id=build_api_key \
    echo "==== SPRAWDZAM SEKRET ====" && \
    ls -la /run/secrets/ && \
    echo "Zawartość sekretu:" && \
    cat /run/secrets/build_api_key && \
    echo "==== KONIEC SEKRETU ===="

CMD ["echo", "Budowanie zakończone."]