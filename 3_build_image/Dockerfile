# Użyj lekkiego obrazu bazowego, np. Alpine Linux, który jest mały.
FROM alpine:latest

# (Opcjonalnie) Możesz zaktualizować repozytoria pakietów, jeśli planujesz
# instalować inne narzędzia, ale dla tego przykładu nie jest to konieczne.
# RUN apk update

# Ustaw katalog roboczy wewnątrz kontenera.
# Wszystkie kolejne polecenia COPY, RUN, CMD będą wykonywane względem tego katalogu.
WORKDIR /app

# Skopiuj wszystkie pliki z bieżącego katalogu budowania (kontekstu Dockera,
# czyli głównego katalogu repozytorium w Jenkinsie po checkout scm)
# do katalogu roboczego (/app) wewnątrz kontenera.
# To skopiuje np. demo_file.txt i inne pliki projektu.
COPY . .

# (Opcjonalnie) Możesz tu zdefiniować etykiety, zmienne środowiskowe itp.
LABEL maintainer="twoj_email@example.com"
LABEL version="1.0-no-makefile"