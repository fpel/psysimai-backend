/*
  Warnings:

  - You are about to drop the column `userId` on the `Config` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_userId_fkey";

-- AlterTable
ALTER TABLE "Config" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UserConfig" (
    "userId" TEXT NOT NULL,
    "configId" TEXT NOT NULL,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("userId","configId")
);

-- AddForeignKey
ALTER TABLE "UserConfig" ADD CONSTRAINT "UserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConfig" ADD CONSTRAINT "UserConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
