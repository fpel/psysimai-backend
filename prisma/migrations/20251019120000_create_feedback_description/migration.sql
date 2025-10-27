-- CreateEnum
CREATE TYPE "FeedbackCategoria" AS ENUM ('EMOCOES_E_PENSAMENTOS', 'REACOES_CORPORAIS', 'IMPULSOS');

-- CreateEnum
CREATE TYPE "FeedbackNivel" AS ENUM ('BOM_DESAFIO', 'DIFICIL_DEMAIS');

-- CreateTable
CREATE TABLE "FeedbackDescription" (
    "id" TEXT NOT NULL,
    "categoria" "FeedbackCategoria" NOT NULL,
    "nivel" "FeedbackNivel" NOT NULL,
    "sentimento" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FeedbackDescription_pkey" PRIMARY KEY ("id")
);
