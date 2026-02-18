-- DropIndex
DROP INDEX "Exam_departmentId_idx";

-- DropIndex
DROP INDEX "Exam_deviceId_idx";

-- DropIndex
DROP INDEX "Exam_examTypeId_idx";

-- DropIndex
DROP INDEX "Exam_probeId_idx";

-- AlterTable
ALTER TABLE "MaintenanceRecord" ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ProbeDailySummary" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "probeId" TEXT NOT NULL,
    "examCount" INTEGER NOT NULL,

    CONSTRAINT "ProbeDailySummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentDailySummary" (
    "date" DATE NOT NULL,
    "departmentId" TEXT NOT NULL,
    "examCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ExamTypeDailySummary" (
    "date" DATE NOT NULL,
    "examTypeId" TEXT NOT NULL,
    "examCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "OperatorDailySummary" (
    "date" DATE NOT NULL,
    "operatorId" TEXT NOT NULL,
    "examCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "PhysicianDailySummary" (
    "date" DATE NOT NULL,
    "physicianId" TEXT NOT NULL,
    "examCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceDailyUtilization" (
    "date" DATE NOT NULL,
    "deviceId" TEXT NOT NULL,
    "usedMinutes" INTEGER NOT NULL,
    "availableMinutes" INTEGER NOT NULL,
    "utilizationRate" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceMonthlySummary" (
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "examCount" INTEGER NOT NULL,
    "operatingMinutes" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProbeDailySummary_date_probeId_key" ON "ProbeDailySummary"("date", "probeId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentDailySummary_date_departmentId_key" ON "DepartmentDailySummary"("date", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamTypeDailySummary_date_examTypeId_key" ON "ExamTypeDailySummary"("date", "examTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorDailySummary_date_operatorId_key" ON "OperatorDailySummary"("date", "operatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicianDailySummary_date_physicianId_key" ON "PhysicianDailySummary"("date", "physicianId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceDailyUtilization_date_deviceId_key" ON "DeviceDailyUtilization"("date", "deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceMonthlySummary_year_month_deviceId_key" ON "DeviceMonthlySummary"("year", "month", "deviceId");

-- CreateIndex
CREATE INDEX "exam_device_startedat_idx" ON "Exam"("deviceId", "startedAt");

-- CreateIndex
CREATE INDEX "exam_probe_startedat_idx" ON "Exam"("probeId", "startedAt");

-- CreateIndex
CREATE INDEX "exam_department_startedat_idx" ON "Exam"("departmentId", "startedAt");

-- CreateIndex
CREATE INDEX "exam_examtype_startedat_idx" ON "Exam"("examTypeId", "startedAt");

-- CreateIndex
CREATE INDEX "exam_operator_startedat_idx" ON "Exam"("operatorId", "startedAt");

-- CreateIndex
CREATE INDEX "exam_physician_startedat_idx" ON "Exam"("physicianId", "startedAt");

-- RenameIndex
ALTER INDEX "Exam_startedAt_idx" RENAME TO "exam_startedat_idx";
