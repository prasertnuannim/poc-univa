import { examPrisma } from "@/server/db/exam/client";
import { Prisma } from "@/server/db/exam/prisma/generated/client";


/* =====================================================
 * Constants
 * ===================================================== */

const GRANULARITY_MAP: Record<TimeGranularity, string> = {
  hour: "hour",
  day: "day",
  week: "week",
  month: "month",
};

/* =====================================================
 * Types
 * ===================================================== */

export type DateFilter =
  | { mode: "day"; date: Date }
  | { mode: "week"; date: Date }
  | { mode: "month"; date: Date }
  | { mode: "year"; date: Date }
  | { mode: "custom"; start: Date; end: Date };

export type TimeGranularity = "hour" | "day" | "week" | "month";

/* =====================================================
 * Utils: Resolve date range
 * ===================================================== */

function resolveDateRange(filter: DateFilter) {
  let start: Date;
  let end: Date;

  switch (filter.mode) {
    case "day":
      start = new Date(filter.date);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
      break;

    case "week":
      start = new Date(filter.date);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 7);
      break;

    case "month":
      start = new Date(filter.date);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      break;

    case "year":
      start = new Date(filter.date);
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      break;

    case "custom":
      start = filter.start;
      end = filter.end;
      break;
  }

  return { start, end };
}

/* =====================================================
 * 1) Exam Volume by Time (Line / Bar)
 * ===================================================== */

export type ExamVolumeTimeRow = {
  period: string;
  total: number;
};

export async function getExamVolumeByTime(
  filter: DateFilter,
  granularity: TimeGranularity
): Promise<{ data: ExamVolumeTimeRow[] }> {
  const { start, end } = resolveDateRange(filter);

  const trunc = Prisma.raw(
    `date_trunc('${GRANULARITY_MAP[granularity]}', "startedAt")`
  );

  const data = await examPrisma.$queryRaw<ExamVolumeTimeRow[]>`
    SELECT
      ${trunc} AS period,
      COUNT(*)::int AS total
    FROM "Exam"
    WHERE
      "startedAt" >= ${start}
      AND "startedAt" < ${end}
    GROUP BY period
    ORDER BY period ASC
  `;

  return { data };
}

/* =====================================================
 * 2) Exam Volume by Type (Donut Chart)
 * ===================================================== */

export type ExamTypeDonutRow = {
  label: string;
  total: number;
};

export async function getExamVolumeByType(
  filter: DateFilter
): Promise<{ data: ExamTypeDonutRow[] }> {
  const { start, end } = resolveDateRange(filter);

  const data = await examPrisma.$queryRaw<ExamTypeDonutRow[]>`
    SELECT
      et.name AS label,
      COUNT(e.id)::int AS total
    FROM "Exam" e
    JOIN "ExamType" et ON et.id = e."examTypeId"
    WHERE
      e."startedAt" >= ${start}
      AND e."startedAt" < ${end}
    GROUP BY et.name
    ORDER BY total DESC
  `;

  return { data };
}

/* =====================================================
 * 3) Exam Volume per Department (Bar Chart)
 * ===================================================== */

export type ExamVolumeDepartmentRow = {
  department: string;
  total: number;
};

export async function getExamVolumePerDepartment(
  filter: DateFilter
): Promise<{ data: ExamVolumeDepartmentRow[] }> {
  const { start, end } = resolveDateRange(filter);

  const data = await examPrisma.$queryRaw<ExamVolumeDepartmentRow[]>`
    SELECT
      d.name AS department,
      COUNT(e.id)::int AS total
    FROM "Exam" e
    JOIN "Department" d ON d.id = e."departmentId"
    WHERE
      e."startedAt" >= ${start}
      AND e."startedAt" < ${end}
    GROUP BY d.name
    ORDER BY total DESC
  `;

  return { data };
}

/* =====================================================
 * 4) Recent Maintenance Records
 * ===================================================== */

export type RecentMaintenanceRow = {
  id: string;
  date: Date;
  device: string;
  details: string;
};

export async function getRecentMaintenanceRecordsRaw(
  limit: number = 5
): Promise<{ data: RecentMaintenanceRow[] }> {
  const data = await examPrisma.$queryRaw<RecentMaintenanceRow[]>`
    SELECT
      m.id,
      m."createdAt" AS date,
      d.name AS device,
      COALESCE(m.details, m.title) AS details
    FROM "MaintenanceRecord" m
    JOIN "Device" d ON d.id = m."deviceId"
    ORDER BY m."createdAt" DESC
    LIMIT ${limit}
  `;

  return { data };
}
