/*
  Warnings:

  - You are about to drop the column `promptId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `configId` on the `Session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_promptId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_configId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "promptId";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "configId",
ADD COLUMN     "promptId" TEXT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
