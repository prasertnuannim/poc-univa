import { examPrisma as prisma } from "../client";

/* ---------------- utils ---------------- */
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* ---------------- seed master ---------------- */
async function seedMasters() {
  console.log("🌱 seeding master data...");

  // ExamTypes
  await prisma.examType.createMany({
    data: Array.from({ length: 12 }, (_, i) => ({
      name: `ExamType-${i + 1}`,
    })),
    skipDuplicates: true,
  });

  // Departments
  await prisma.department.createMany({
    data: Array.from({ length: 6 }, (_, i) => ({
      name: `Department-${i + 1}`,
    })),
    skipDuplicates: true,
  });

  const departments = await prisma.department.findMany();

  // Devices
  for (const dep of departments) {
    await prisma.device.createMany({
      data: Array.from({ length: rand(3, 6) }, (_, i) => ({
        name: `Device-${dep.name}-${i + 1}`,
        model: `Model-${rand(100, 999)}`,
        departmentId: dep.id,
      })),
      skipDuplicates: true,
    });
  }

  // Probes
  await prisma.probe.createMany({
    data: Array.from({ length: 15 }, (_, i) => ({
      name: `Probe-${i + 1}`,
      type: Math.random() > 0.5 ? "Convex" : "Linear",
    })),
    skipDuplicates: true,
  });

  // Operators
  await prisma.operator.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      fullName: `Operator ${i + 1}`,
    })),
    skipDuplicates: true,
  });

  // Physicians
  await prisma.physician.createMany({
    data: Array.from({ length: 8 }, (_, i) => ({
      fullName: `Physician ${i + 1}`,
    })),
    skipDuplicates: true,
  });

  console.log("✅ master data ready");
}

/* ---------------- main ---------------- */
async function main() {
  await seedMasters();
}

main()
  .catch(err => {
    console.error("❌ seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });