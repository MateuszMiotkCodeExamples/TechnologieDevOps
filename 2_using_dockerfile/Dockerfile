# Użyj bardziej ogólnego lub potwierdzonego tagu dla obrazu Node.js Alpine
# Na przykład, 'node:22-alpine' dla najnowszej wersji Node.js 22 na Alpine,
# lub 'node:lts-alpine' dla najnowszej wersji LTS (Long Term Support) na Alpine.
FROM node:22-alpine

# Dodaj pakiet Subversion (svn)
# Opcja -U (lub --update-cache) nie jest już potrzebna w nowszych wersjach apk,
# ale jej użycie nie zaszkodzi. Można ją pominąć.
RUN apk add --no-cache subversion