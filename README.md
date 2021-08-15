A sample angular app front end with a postGIS database and a PostgREST api layer.

### To launch the stack

You might have to increase docker's memory allocation if the postgrest container exits randomly (OOM 137)

First, create a .env file. 

```
docker-compose up
```

When the containers are ready, there are some manual steps to provision the database and load the locations data
```
source .env
export PGPASSWORD=$POSTGRES_APP_PASSWORD
psql --host=$DATABASE_HOST --username=$POSTGRES_APP_USER --dbname=$POSTGRES_APP_DB --file=create-table.sql
curl --header "Content-Type: application/json" --data @locations.json http://$DATABASE_HOST:3000/locations
psql --host=$DATABASE_HOST --username=$POSTGRES_APP_USER --dbname=$POSTGRES_APP_DB --file=add-geography.sql
psql --host=$DATABASE_HOST --username=$POSTGRES_APP_USER --dbname=$POSTGRES_APP_DB --file=distance_func.sql
```
You will need to reload postgrest's schema cache so it will recognize the new function:
```
docker kill -s SIGUSR1 [ api container ]
```

#### Notes

To request locations ordered by distance, POST to
```
$DATABASE_HOST:3000/rpc/distances?distance=lt.70&order=distance
```
with body
```
{ "lat": <lat>, "lng": <lng> }
```

leaflet.js map layer providers:

http://leaflet-extras.github.io/leaflet-providers/preview/index.html



to run the angular server, from locations/ directory
```
np serve
```