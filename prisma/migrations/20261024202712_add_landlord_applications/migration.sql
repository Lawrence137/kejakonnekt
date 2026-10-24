-- CreateEnum
CREATE TYPE "ApplicantType" AS ENUM ('LANDLORD', 'AGENT');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('NATIONAL_ID', 'PASSPORT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "LandlordApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicantType" "ApplicantType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "idType" "IdType" NOT NULL,
    "idNumber" TEXT NOT NULL,
    "businessName" TEXT,
    "idFrontPath" TEXT NOT NULL,
    "idBackPath" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandlordApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandlordApplication_userId_status_idx" ON "LandlordApplication"("userId", "status");

-- CreateIndex
CREATE INDEX "LandlordApplication_status_createdAt_idx" ON "LandlordApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "LandlordApplication_idNumber_idx" ON "LandlordApplication"("idNumber");

-- AddForeignKey
ALTER TABLE "LandlordApplication" ADD CONSTRAINT "LandlordApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordApplication" ADD CONSTRAINT "LandlordApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
