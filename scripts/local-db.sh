#!/usr/bin/env bash
# Postgres 16 local (Docker) pour le développement et les tests d'intégration.
# Identifiants de développement uniquement (aucune donnée de production).
#   scripts/local-db.sh up | down | reset | url
set -euo pipefail
NAME=evexpert-pg
PORT=54329
URL="postgresql://postgres:postgres@127.0.0.1:${PORT}/evexpert_dev"
case "${1:-up}" in
  up)
    if ! docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
      docker run -d --name "$NAME" -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=evexpert_dev \
        -p 127.0.0.1:${PORT}:5432 -v evexpert-pg-data:/var/lib/postgresql/data postgres:16-alpine >/dev/null
    else
      docker start "$NAME" >/dev/null
    fi
    until docker exec "$NAME" pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
    echo "Postgres prêt : $URL" ;;
  down) docker stop "$NAME" >/dev/null && echo "arrêté" ;;
  reset) docker rm -f "$NAME" >/dev/null 2>&1 || true; docker volume rm evexpert-pg-data >/dev/null 2>&1 || true; "$0" up ;;
  url) echo "$URL" ;;
  *) echo "usage: $0 up|down|reset|url" >&2; exit 1 ;;
esac
