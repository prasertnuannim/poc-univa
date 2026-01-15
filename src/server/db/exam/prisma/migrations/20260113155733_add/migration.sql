/*
  Warnings:

  - The `status` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `MaintenanceRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MaintenanceRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'CALIBRATION', 'INSPECTION');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "Exam_status_idx";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "probeId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ExamStatus" NOT NULL DEFAULT 'COMPLETED';

-- AlterTable
ALTER TABLE "MaintenanceRecord" DROP COLUMN "type",
ADD COLUMN     "type" "MaintenanceType" NOT NULL DEFAULT 'PREVENTIVE',
DROP COLUMN "status",
ADD COLUMN     "status" "MaintenanceStatus" NOT NULL DEFAULT 'COMPLETED';

-- CreateTable
CREATE TABLE "Probe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Probe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceProbe" (
    "deviceId" TEXT NOT NULL,
    "probeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DeviceProbe_pkey" PRIMARY KEY ("deviceId","probeId")
);

-- CreateIndex
CREATE INDEX "DeviceProbe_deviceId_idx" ON "DeviceProbe"("deviceId");

-- CreateIndex
CREATE INDEX "DeviceProbe_probeId_idx" ON "DeviceProbe"("probeId");

-- CreateIndex
CREATE INDEX "Exam_probeId_idx" ON "Exam"("probeId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_type_idx" ON "MaintenanceRecord"("type");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_status_idx" ON "MaintenanceRecord"("status");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_probeId_fkey" FOREIGN KEY ("probeId") REFERENCES "Probe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceProbe" ADD CONSTRAINT "DeviceProbe_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceProbe" ADD CONSTRAINT "DeviceProbe_probeId_fkey" FOREIGN KEY ("probeId") REFERENCES "Probe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
