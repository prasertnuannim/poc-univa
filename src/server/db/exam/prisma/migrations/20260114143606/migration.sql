/*
  Warnings:

  - You are about to drop the column `name` on the `Operator` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Physician` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullName]` on the table `Operator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fullName]` on the table `Physician` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Operator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Physician` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Physician" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExamDailySummary" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "examTypeId" TEXT,
    "departmentId" TEXT,
    "total" INTEGER NOT NULL,

    CONSTRAINT "ExamDailySummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamMonthlySummary" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "examTypeId" TEXT,
    "departmentId" TEXT,
    "total" INTEGER NOT NULL,

    CONSTRAINT "ExamMonthlySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamDailySummary_date_examTypeId_departmentId_key" ON "ExamDailySummary"("date", "examTypeId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamMonthlySummary_year_month_examTypeId_departmentId_key" ON "ExamMonthlySummary"("year", "month", "examTypeId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_fullName_key" ON "Operator"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Physician_fullName_key" ON "Physician"("fullName");
