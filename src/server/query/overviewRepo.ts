import { examPrisma } from "@/server/db/exam/client";
import { Prisma } from "@/server/db/exam/prisma/generated/client";
import { GRANULARITY_MAP, type TimeGranularity } from "@/server/constants/dashboard";

const TZ = "Asia/Bangkok";

export async function getVolumeByTime(
  start: Date,
  end: Date,
  granularity: TimeGranularity
) {
  const g = GRANULARITY_MAP[granularity]; // must be whitelist เช่น 'hour' | 'day' | ...
  const periodExpr = Prisma.raw(
    `date_trunc('${g}', "startedAt" AT TIME ZONE '${TZ}')`
  );
console.log("start>>",start , "  ", "end>>", end, " granularity>>", granularity);
  return examPrisma.$queryRaw<{ period: Date; total: number }[]>`
    SELECT ${periodExpr} AS period, COUNT(*)::int AS total
    FROM "Exam"
    WHERE "startedAt" >= ${start} AND "startedAt" < ${end}
    GROUP BY period
    ORDER BY period ASC
  `;
}

export async function getVolumeByType(start: Date, end: Date) {
  return examPrisma.$queryRaw<{ label: string; total: number }[]>`
    SELECT et.name AS label, COUNT(e.id)::int AS total
    FROM "Exam" e
    JOIN "ExamType" et ON et.id = e."examTypeId"
    WHERE e."startedAt" >= ${start} AND e."startedAt" < ${end}
    GROUP BY et.name
    ORDER BY total DESC
  `;
}

export async function getVolumeByDepartment(start: Date, end: Date) {
  return examPrisma.$queryRaw<{ department: string; total: number }[]>`
    SELECT d.name AS department, COUNT(e.id)::int AS total
    FROM "Exam" e
    JOIN "Department" d ON d.id = e."departmentId"
    WHERE e."startedAt" >= ${start} AND e."startedAt" < ${end}
    GROUP BY d.name
    ORDER BY total DESC
  `;
}

export async function getRecentMaintenance(limit: number) {
  return examPrisma.$queryRaw<{ id: string; date: Date; device: string; details: string }[]>`
    SELECT m.id, m."createdAt" AS date, d.name AS device, COALESCE(m.details, m.title) AS details
    FROM "MaintenanceRecord" m
    JOIN "Device" d ON d.id = m."deviceId"
    ORDER BY m."createdAt" DESC
    LIMIT ${limit}
  `;
}
