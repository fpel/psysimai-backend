/*
  Warnings:

  - Added the required column `difficultyLevelId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "difficultyLevelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "DifficultyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
