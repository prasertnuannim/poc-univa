/*
  Warnings:

  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `Device` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `model` on the `Device` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `DeviceProbe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `operatorId` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `physicianId` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `probeId` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ExamDailySummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `examTypeId` column on the `ExamDailySummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `departmentId` column on the `ExamDailySummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ExamMonthlySummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `examTypeId` column on the `ExamMonthlySummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `departmentId` column on the `ExamMonthlySummary` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ExamType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `ExamType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `MaintenanceRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `title` on the `MaintenanceRecord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `details` on the `MaintenanceRecord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `Operator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `fullName` on the `Operator` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `Physician` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `fullName` on the `Physician` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `Probe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `Probe` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `type` on the `Probe` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `ProbeDailySummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `probeId` on the `ProbeDailySummary` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Changed the type of `id` on the `Department` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `DepartmentDailySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `Device` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deviceId` on the `DeviceDailyUtilization` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deviceId` on the `DeviceMonthlySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deviceId` on the `DeviceProbe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `probeId` on the `DeviceProbe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `examTypeId` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deviceId` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departmentId` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ExamDailySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ExamMonthlySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ExamType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `examTypeId` on the `ExamTypeDailySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `MaintenanceRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deviceId` on the `MaintenanceRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Operator` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `operatorId` on the `OperatorDailySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Physician` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `physicianId` on the `PhysicianDailySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Probe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ProbeDailySummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DeviceProbe" DROP CONSTRAINT "DeviceProbe_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "DeviceProbe" DROP CONSTRAINT "DeviceProbe_probeId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_examTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_physicianId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_probeId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceRecord" DROP CONSTRAINT "MaintenanceRecord_deviceId_fkey";

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DepartmentDailySummary" DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "model" SET DATA TYPE VARCHAR(255),
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DeviceDailyUtilization" DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "DeviceMonthlySummary" DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "DeviceProbe" DROP CONSTRAINT "DeviceProbe_pkey",
DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" UUID NOT NULL,
DROP COLUMN "probeId",
ADD COLUMN     "probeId" UUID NOT NULL,
ADD CONSTRAINT "DeviceProbe_pkey" PRIMARY KEY ("deviceId", "probeId");

-- AlterTable
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "examTypeId",
ADD COLUMN     "examTypeId" UUID NOT NULL,
DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" UUID NOT NULL,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID NOT NULL,
DROP COLUMN "operatorId",
ADD COLUMN     "operatorId" UUID,
DROP COLUMN "physicianId",
ADD COLUMN     "physicianId" UUID,
DROP COLUMN "probeId",
ADD COLUMN     "probeId" UUID,
ADD CONSTRAINT "Exam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamDailySummary" DROP CONSTRAINT "ExamDailySummary_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "examTypeId",
ADD COLUMN     "examTypeId" UUID,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID,
ADD CONSTRAINT "ExamDailySummary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamMonthlySummary" DROP CONSTRAINT "ExamMonthlySummary_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "examTypeId",
ADD COLUMN     "examTypeId" UUID,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" UUID,
ADD CONSTRAINT "ExamMonthlySummary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamType" DROP CONSTRAINT "ExamType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "ExamType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamTypeDailySummary" DROP COLUMN "examTypeId",
ADD COLUMN     "examTypeId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceRecord" DROP CONSTRAINT "MaintenanceRecord_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "deviceId",
ADD COLUMN     "deviceId" UUID NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "details" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "type" SET DEFAULT 'PREVENTIVE',
ALTER COLUMN "status" SET DEFAULT 'COMPLETED',
ADD CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Operator" DROP CONSTRAINT "Operator_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Operator_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OperatorDailySummary" DROP COLUMN "operatorId",
ADD COLUMN     "operatorId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Physician" DROP CONSTRAINT "Physician_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Physician_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PhysicianDailySummary" DROP COLUMN "physicianId",
ADD COLUMN     "physicianId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Probe" DROP CONSTRAINT "Probe_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Probe_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProbeDailySummary" DROP CONSTRAINT "ProbeDailySummary_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "probeId" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "ProbeDailySummary_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentDailySummary_date_departmentId_key" ON "DepartmentDailySummary"("date", "departmentId");

-- CreateIndex
CREATE INDEX "Device_departmentId_idx" ON "Device"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceDailyUtilization_date_deviceId_key" ON "DeviceDailyUtilization"("date", "deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceMonthlySummary_year_month_deviceId_key" ON "DeviceMonthlySummary"("year", "month", "deviceId");

-- CreateIndex
CREATE INDEX "DeviceProbe_deviceId_idx" ON "DeviceProbe"("deviceId");

-- CreateIndex
CREATE INDEX "DeviceProbe_probeId_idx" ON "DeviceProbe"("probeId");

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

-- CreateIndex
CREATE UNIQUE INDEX "ExamDailySummary_date_examTypeId_departmentId_key" ON "ExamDailySummary"("date", "examTypeId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamMonthlySummary_year_month_examTypeId_departmentId_key" ON "ExamMonthlySummary"("year", "month", "examTypeId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamTypeDailySummary_date_examTypeId_key" ON "ExamTypeDailySummary"("date", "examTypeId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_deviceId_idx" ON "MaintenanceRecord"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorDailySummary_date_operatorId_key" ON "OperatorDailySummary"("date", "operatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicianDailySummary_date_physicianId_key" ON "PhysicianDailySummary"("date", "physicianId");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_probeId_fkey" FOREIGN KEY ("probeId") REFERENCES "Probe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "Physician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceProbe" ADD CONSTRAINT "DeviceProbe_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceProbe" ADD CONSTRAINT "DeviceProbe_probeId_fkey" FOREIGN KEY ("probeId") REFERENCES "Probe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
