-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "batchId" TEXT;

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalUrls" INTEGER NOT NULL DEFAULT 0,
    "successful" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
