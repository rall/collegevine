CREATE OR REPLACE FUNCTION distances(lat float, lng float) RETURNS TABLE(name text, image_url text, distance float) AS $BODY$
SELECT "name", "image_url", (ST_Distance("point", ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) / 1609.344) AS "distance" FROM "locations"
$BODY$ LANGUAGE 'sql';

