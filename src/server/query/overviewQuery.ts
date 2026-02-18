import { examPrisma } from "@/server/db/exam/client";
import { GRANULARITY_MAP, type TimeGranularity } from "@/server/constants/dashboard";

const STEP_MAP: Record<TimeGranularity, string> = {
  hour: "1 hour",
  day: "1 day",
  week: "1 week",
  month: "1 month",
};

const LABEL_FORMAT_MAP: Record<TimeGranularity, string> = {
  hour: "HH24:00",
  day: "DD Mon",
  week: '"W"IW YYYY',
  month: "Mon YYYY",
};

export async function getVolumeByTime(
  start: Date,
  end: Date,
  granularity: TimeGranularity
) {
  const trunc = GRANULARITY_MAP[granularity];
  const step = STEP_MAP[granularity];
  const labelFormat = LABEL_FORMAT_MAP[granularity];

  return examPrisma.$queryRaw<
    { label: string; total: number }[]
  >`
    WITH bounds AS (
      SELECT
        date_trunc(${trunc}, ${start}::timestamp) AS start_period,
        date_trunc(${trunc}, ${end}::timestamp)   AS end_period
    ),
    series AS (
      SELECT generate_series(
        b.start_period,
        b.end_period - ${step}::interval,
        ${step}::interval
      ) AS period
      FROM bounds b
    )
    SELECT
      to_char(s.period, ${labelFormat}) AS label,
      COUNT(e.id)::int AS total
    FROM series s
    LEFT JOIN "Exam" e
      ON e."startedAt" >= s.period
     AND e."startedAt" <  s.period + ${step}::interval
    GROUP BY s.period
    ORDER BY s.period ASC;
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
