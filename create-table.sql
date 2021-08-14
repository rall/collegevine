-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "address__city" TEXT,
    "address__state" TEXT,
    "address__latitude" FLOAT,
    "address__longitude" FLOAT,
    "image_url" TEXT,
    PRIMARY KEY ("id")
);
