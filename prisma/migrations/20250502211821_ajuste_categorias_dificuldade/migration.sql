/*
  Warnings:

  - You are about to drop the column `difficultyLevelId` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `skillCategoryId` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `difficultyLevelId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `difficultyLevelId` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillCategoryId` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_difficultyLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_difficultyLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_skillCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_difficultyLevelId_fkey";

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "difficultyLevelId" TEXT NOT NULL,
ADD COLUMN     "skillCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "difficultyLevelId",
DROP COLUMN "skillCategoryId";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "difficultyLevelId";

-- DropTable
DROP TABLE "Progress";

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "SkillCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "DifficultyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
