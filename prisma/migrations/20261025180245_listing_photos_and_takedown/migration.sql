-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'REMOVED';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "removedReason" TEXT;

-- AlterTable
ALTER TABLE "ListingImage" ADD COLUMN     "thumbUrl" TEXT;
