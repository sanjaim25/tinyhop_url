-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "customAlias" TEXT,
    "expiresAt" TIMESTAMP(3),
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlId" TEXT NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortCode_key" ON "Url"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Url_customAlias_key" ON "Url"("customAlias");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
