/*
  Warnings:

  - You are about to drop the column `promptId` on the `ExpectedResponse` table. All the data in the column will be lost.
  - You are about to drop the column `promptId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prompt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserConfig` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `estimuloId` to the `ExpectedResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimuloId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_difficultyLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_skillCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ExpectedResponse" DROP CONSTRAINT "ExpectedResponse_promptId_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_configId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_promptId_fkey";

-- DropForeignKey
ALTER TABLE "UserConfig" DROP CONSTRAINT "UserConfig_configId_fkey";

-- DropForeignKey
ALTER TABLE "UserConfig" DROP CONSTRAINT "UserConfig_userId_fkey";

-- AlterTable
ALTER TABLE "ExpectedResponse" DROP COLUMN "promptId",
ADD COLUMN     "estimuloId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "promptId",
ADD COLUMN     "estimuloId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Config";

-- DropTable
DROP TABLE "Prompt";

-- DropTable
DROP TABLE "UserConfig";

-- CreateTable
CREATE TABLE "Estimulo" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "criteriosAvaliacao" TEXT,
    "feedback" TEXT,
    "order" INTEGER NOT NULL,
    "skillCategoryId" TEXT NOT NULL,
    "difficultyLevelId" TEXT NOT NULL,

    CONSTRAINT "Estimulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEstimulo" (
    "userId" TEXT NOT NULL,
    "estimuloId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEstimulo_pkey" PRIMARY KEY ("userId","estimuloId")
);

-- AddForeignKey
ALTER TABLE "Estimulo" ADD CONSTRAINT "Estimulo_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "SkillCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimulo" ADD CONSTRAINT "Estimulo_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "DifficultyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEstimulo" ADD CONSTRAINT "UserEstimulo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEstimulo" ADD CONSTRAINT "UserEstimulo_estimuloId_fkey" FOREIGN KEY ("estimuloId") REFERENCES "Estimulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpectedResponse" ADD CONSTRAINT "ExpectedResponse_estimuloId_fkey" FOREIGN KEY ("estimuloId") REFERENCES "Estimulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_estimuloId_fkey" FOREIGN KEY ("estimuloId") REFERENCES "Estimulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
