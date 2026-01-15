import { prisma } from "../client";
import type { Prisma } from "./generated/client";

/* =====================================================
 * Utils
 * ===================================================== */

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addMinutes(date: Date, min: number) {
  return new Date(date.getTime() + min * 60000);
}

/* =====================================================
 * Seed
 * ===================================================== */

async function main() {
  console.log("🌱 Start seeding 1 month data...");

  /* -------------------------
   * Departments
   * ------------------------- */
  const departments = await prisma.department.createMany({
    data: [
      { name: "Radiology" },
      { name: "OB-GYN" },
      { name: "Cardiology" },
    ],
    skipDuplicates: true,
  });

  const departmentList = await prisma.department.findMany();

  /* -------------------------
   * Exam Types
   * ------------------------- */
  await prisma.examType.createMany({
    data: [
      { name: "Abdomen" },
      { name: "Fetal" },
      { name: "Heart" },
    ],
    skipDuplicates: true,
  });

  const examTypes = await prisma.examType.findMany();

  /* -------------------------
   * Operators
   * ------------------------- */
  await prisma.operator.createMany({
    data: [
      { fullName: "Operator A" },
      { fullName: "Operator B" },
      { fullName: "Operator C" },
    ],
    skipDuplicates: true,
  });

  const operators = await prisma.operator.findMany();

  /* -------------------------
   * Physicians
   * ------------------------- */
  await prisma.physician.createMany({
    data: [
      { fullName: "Dr. Smith" },
      { fullName: "Dr. Jane" },
      { fullName: "Dr. John" },
    ],
    skipDuplicates: true,
  });

  const physicians = await prisma.physician.findMany();

  /* -------------------------
   * Devices
   * ------------------------- */
  const devices: Prisma.DeviceCreateManyInput[] = [];
  for (const dept of departmentList) {
    for (let i = 1; i <= 2; i++) {
      devices.push({
        name: `${dept.name}-US-${i}`,
        model: "Ultrasound X",
        departmentId: dept.id,
      });
    }
  }

  await prisma.device.createMany({
    data: devices,
    skipDuplicates: true,
  });

  const deviceList = await prisma.device.findMany();

  /* -------------------------
   * Probes
   * ------------------------- */
  await prisma.probe.createMany({
    data: [
      { name: "Linear", type: "Linear" },
      { name: "Convex", type: "Convex" },
      { name: "Phased", type: "Phased" },
    ],
    skipDuplicates: true,
  });

  const probes = await prisma.probe.findMany();

  /* -------------------------
   * Device ↔ Probe
   * ------------------------- */
  for (const device of deviceList) {
    const probeCount = randomInt(1, probes.length);
    const assigned = probes.slice(0, probeCount);

    for (const probe of assigned) {
      await prisma.deviceProbe.upsert({
        where: {
          deviceId_probeId: {
            deviceId: device.id,
            probeId: probe.id,
          },
        },
        update: {},
        create: {
          deviceId: device.id,
          probeId: probe.id,
        },
      });
    }
  }

  /* -------------------------
   * Exams (ย้อนหลัง 30 วัน)
   * ------------------------- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);

    const examsPerDay = randomInt(5, 15);

    for (let i = 0; i < examsPerDay; i++) {
      const device = randomFrom(deviceList);
      const examType = randomFrom(examTypes);
      const operator = randomFrom(operators);
      const physician = randomFrom(physicians);
      const probe = randomFrom(probes);

      const start = addMinutes(date, randomInt(8 * 60, 17 * 60));
      const finish = addMinutes(start, randomInt(10, 40));

      await prisma.exam.create({
        data: {
          examTypeId: examType.id,
          deviceId: device.id,
          departmentId: device.departmentId,
          probeId: probe.id,
          operatorId: operator.id,
          physicianId: physician.id,
          startedAt: start,
          finishedAt: finish,
          status: "COMPLETED",
        },
      });
    }
  }

  console.log("✅ Seed completed (1 month data)");
}

/* =====================================================
 * Run
 * ===================================================== */

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
