-- CreateEnum
CREATE TYPE "public"."BodyType" AS ENUM ('sedan', 'hatchback', 'wagon', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'other');

-- CreateEnum
CREATE TYPE "public"."FuelType" AS ENUM ('gasoline', 'diesel', 'hybrid', 'electric', 'lpg', 'other');

-- CreateEnum
CREATE TYPE "public"."PartCategory" AS ENUM ('engine', 'transmission', 'suspension', 'brakes', 'electrical', 'body', 'interior', 'exterior', 'other');

-- CreateEnum
CREATE TYPE "public"."PartCondition" AS ENUM ('excellent', 'good', 'fair', 'poor', 'broken');

-- CreateEnum
CREATE TYPE "public"."PartStatus" AS ENUM ('available', 'reserved', 'sold', 'scrapped');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MANAGER', 'USER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cars" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "bodyType" "public"."BodyType" NOT NULL,
    "fuelType" "public"."FuelType" NOT NULL,
    "engineVolume" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parts" (
    "id" TEXT NOT NULL,
    "zapchastName" TEXT NOT NULL,
    "category" "public"."PartCategory" NOT NULL,
    "carId" TEXT NOT NULL,
    "condition" "public"."PartCondition" NOT NULL,
    "status" "public"."PartStatus" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sales" (
    "id" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cars_vin_key" ON "public"."cars"("vin");

-- AddForeignKey
ALTER TABLE "public"."parts" ADD CONSTRAINT "parts_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales" ADD CONSTRAINT "sales_partId_fkey" FOREIGN KEY ("partId") REFERENCES "public"."parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
