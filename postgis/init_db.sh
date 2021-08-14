#!/bin/bash
set -e

echo "Initializing PostgreSQL database"
psql --username=$POSTGRES_USER ON_ERROR_STOP=1 --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER ${POSTGRES_APP_USER} WITH PASSWORD '${POSTGRES_APP_PASSWORD}';
    CREATE DATABASE locationdb;
    CREATE DATABASE ${POSTGRES_APP_DB} OWNER ${POSTGRES_APP_USER} TEMPLATE template_postgis;
EOSQL
