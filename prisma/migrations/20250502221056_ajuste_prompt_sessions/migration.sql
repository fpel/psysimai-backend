/*
  Warnings:

  - Made the column `promptId` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_promptId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "promptId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
