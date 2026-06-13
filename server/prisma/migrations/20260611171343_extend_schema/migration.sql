-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "deviceRouting" JSONB,
ADD COLUMN     "geoRouting" JSONB,
ADD COLUMN     "linkInBioId" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "qrConfig" JSONB,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "workspaceId" TEXT;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "browser" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "device" TEXT NOT NULL DEFAULT 'Desktop',
ADD COLUMN     "referer" TEXT NOT NULL DEFAULT 'Direct';

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkInBio" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'mono',
    "socials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkInBio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_hostname_key" ON "Domain"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "LinkInBio_slug_key" ON "LinkInBio"("slug");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_linkInBioId_fkey" FOREIGN KEY ("linkInBioId") REFERENCES "LinkInBio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
