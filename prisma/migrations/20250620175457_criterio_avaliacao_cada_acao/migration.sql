/*
  Warnings:

  - You are about to drop the `Configuracao` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "criteriosAvaliacao" TEXT,
ADD COLUMN     "feedback" TEXT;

-- DropTable
DROP TABLE "Configuracao";
