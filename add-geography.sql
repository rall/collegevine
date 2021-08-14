ALTER TABLE "locations" ADD COLUMN "point" GEOGRAPHY(POINT, 4326);
UPDATE "locations" SET "point" = ST_SetSRID(ST_MakePoint(address__longitude, address__latitude), 4326)::geography 
