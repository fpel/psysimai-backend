/*
  Warnings:

  - You are about to drop the column `description` on the `DifficultyLevel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SkillCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DifficultyLevel" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "SkillCategory" DROP COLUMN "name";
