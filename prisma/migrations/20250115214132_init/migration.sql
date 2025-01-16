-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" INTEGER[],
    "special_privledges" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" BIGSERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Region" TEXT,
    "contentType" TEXT,
    "fileSize" INTEGER,
    "metadata" JSONB,
    "artworkId" INTEGER,
    "photoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "specificAddress" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "province" TEXT,
    "city" TEXT,
    "googlePlaceId" TEXT,
    "locationType" TEXT,
    "memo" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "id" SERIAL NOT NULL,
    "date" TEXT,
    "name" TEXT,
    "originalSource" TEXT[],
    "primaryTool" TEXT,
    "locationId" INTEGER,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photography" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExifData" (
    "id" SERIAL NOT NULL,
    "cameraMake" TEXT,
    "cameraModel" TEXT,
    "lensModel" TEXT,
    "focalLength" DOUBLE PRECISION,
    "iso" INTEGER,
    "shutterSpeed" TEXT,
    "aperture" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "photoId" INTEGER NOT NULL,

    CONSTRAINT "ExifData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkTag" (
    "int" SERIAL NOT NULL,
    "artworkId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ArtworkTag_pkey" PRIMARY KEY ("int")
);

-- CreateTable
CREATE TABLE "PhotoTag" (
    "int" SERIAL NOT NULL,
    "photoId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "PhotoTag_pkey" PRIMARY KEY ("int")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionArtwork" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "artworkId" INTEGER NOT NULL,

    CONSTRAINT "CollectionArtwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionPhotography" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "photographyId" INTEGER NOT NULL,

    CONSTRAINT "CollectionPhotography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionTag" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "CollectionTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Media_uuid_key" ON "Media"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Location_googlePlaceId_specificAddress_key" ON "Location"("googlePlaceId", "specificAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ExifData_photoId_key" ON "ExifData"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtworkTag_artworkId_tagId_key" ON "ArtworkTag"("artworkId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoTag_photoId_tagId_key" ON "PhotoTag"("photoId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionArtwork_collectionId_artworkId_key" ON "CollectionArtwork"("collectionId", "artworkId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionPhotography_collectionId_photographyId_key" ON "CollectionPhotography"("collectionId", "photographyId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionTag_collectionId_tagId_key" ON "CollectionTag"("collectionId", "tagId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photography"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photography" ADD CONSTRAINT "Photography_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExifData" ADD CONSTRAINT "ExifData_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkTag" ADD CONSTRAINT "ArtworkTag_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkTag" ADD CONSTRAINT "ArtworkTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoTag" ADD CONSTRAINT "PhotoTag_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoTag" ADD CONSTRAINT "PhotoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionArtwork" ADD CONSTRAINT "CollectionArtwork_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionArtwork" ADD CONSTRAINT "CollectionArtwork_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionPhotography" ADD CONSTRAINT "CollectionPhotography_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionPhotography" ADD CONSTRAINT "CollectionPhotography_photographyId_fkey" FOREIGN KEY ("photographyId") REFERENCES "Photography"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTag" ADD CONSTRAINT "CollectionTag_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTag" ADD CONSTRAINT "CollectionTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
