import { examPrisma as prisma } from "../client";
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

function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

/* =====================================================
 * Seed
 * ===================================================== */

async function main() {
  console.log("🌱 Start heavy seeding (±3 months)...");

  /* -------------------------
   * Master data (เหมือนเดิม)
   * ------------------------- */

  await prisma.department.createMany({
    data: [
      { name: "Radiology" },
      { name: "OB-GYN" },
      { name: "Cardiology" },
    ],
    skipDuplicates: true,
  });

  const departments = await prisma.department.findMany();

  await prisma.examType.createMany({
    data: [
      { name: "Abdomen" },
      { name: "Fetal" },
      { name: "Heart" },
      { name: "Vascular" },
    ],
    skipDuplicates: true,
  });

  const examTypes = await prisma.examType.findMany();

  await prisma.operator.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      fullName: `Operator ${i + 1}`,
    })),
    skipDuplicates: true,
  });

  const operators = await prisma.operator.findMany();

  await prisma.physician.createMany({
    data: Array.from({ length: 8 }).map((_, i) => ({
      fullName: `Dr. ${String.fromCharCode(65 + i)}`,
    })),
    skipDuplicates: true,
  });

  const physicians = await prisma.physician.findMany();

  /* -------------------------
   * Devices
   * ------------------------- */

  const devices: Prisma.DeviceCreateManyInput[] = [];

  for (const dept of departments) {
    for (let i = 1; i <= 4; i++) {
      devices.push({
        name: `${dept.name}-US-${i}`,
        model: "Ultrasound X-Pro",
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
      { name: "Endocavity", type: "Endocavity" },
    ],
    skipDuplicates: true,
  });

  const probes = await prisma.probe.findMany();

  /* -------------------------
   * Device ↔ Probe
   * ------------------------- */

  for (const device of deviceList) {
    const probeCount = randomInt(2, probes.length);
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
   * Exams (HEAVY DATA)
   * ------------------------- */

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const DAYS_RANGE = 90; // ±3 เดือน
  const examsBuffer: Prisma.ExamCreateManyInput[] = [];

  for (let offset = -DAYS_RANGE; offset <= DAYS_RANGE; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const future = date > today;
    const weekend = isWeekend(date);

    const examsPerDay = weekend
      ? randomInt(5, 15)
      : randomInt(30, 80);

    for (let i = 0; i < examsPerDay; i++) {
      const device = randomFrom(deviceList);
      const examType = randomFrom(examTypes);
      const operator = randomFrom(operators);
      const physician = randomFrom(physicians);
      const probe = randomFrom(probes);

      const start = addMinutes(
        date,
        randomInt(8 * 60, 18 * 60) // 08:00–18:00
      );

      const duration = randomInt(10, 60);
      const finish = addMinutes(start, duration);

      examsBuffer.push({
        examTypeId: examType.id,
        deviceId: device.id,
        departmentId: device.departmentId,
        probeId: probe.id,
        operatorId: operator.id,
        physicianId: physician.id,
        startedAt: start,
        finishedAt: future ? null : finish,
        status: future ? "SCHEDULED" : "COMPLETED",
      });
    }
  }

  console.log(`🧪 Creating ${examsBuffer.length} exams...`);

  await prisma.exam.createMany({
    data: examsBuffer,
  });

  console.log("✅ Heavy seed completed (±3 months)");
}

/* =====================================================
 * Run
 * ===================================================== */

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
