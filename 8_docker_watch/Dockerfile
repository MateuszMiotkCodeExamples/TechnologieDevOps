# watch-simple/Dockerfile
FROM python:3.10-alpine

WORKDIR /app

# Kopiuj najpierw requirements.txt dla buforowania warstw
COPY requirements.txt .
# Zainstaluj zależności (obecnie brak)
# RUN pip install -r requirements.txt

# Kopiuj kod źródłowy i konfigurację
COPY src/ /app/src/
COPY config/ /app/config/

# Polecenie uruchamiające aplikację
CMD ["python", "-u", "src/app.py"]
# Opcja -u w pythonie zapobiega buforowaniu stdout/stderr, co ułatwia obserwację logów
