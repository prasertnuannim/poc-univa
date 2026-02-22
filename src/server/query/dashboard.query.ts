import { examPrisma } from "@/server/db/exam/client";
import { DateFilterDTO, SelectedBarDTO, TabKey } from "@/server/dto/dashboard.dto";

type ChartRow = { label: string; value: number };

const TOP_LIMIT = 12;

const TAB_ENTITY_MAP: Record<
  TabKey,
  { table: string; examForeignKey: string; labelColumn: string }
> = {
  devices: { table: "Device", examForeignKey: "deviceId", labelColumn: "name" },
  probes: { table: "Probe", examForeignKey: "probeId", labelColumn: "name" },
  units: { table: "Department", examForeignKey: "departmentId", labelColumn: "name" },
  examTypes: { table: "ExamType", examForeignKey: "examTypeId", labelColumn: "name" },
  operators: { table: "Operator", examForeignKey: "operatorId", labelColumn: "fullName" },
  physicians: { table: "Physician", examForeignKey: "physicianId", labelColumn: "fullName" },
};

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function makeUtcDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function resolveDateRange(filter: DateFilterDTO) {
  const now = new Date();
  const utcTodayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
console.log("fileter dashboard >>>>>>>>>>>>>>>>>> ", filter.mode);
  if (filter.mode === "day") {
    const start = makeUtcDate(`${filter.dateISO}T00:00:00.000Z`) ?? utcTodayStart;
    return { start, end: addUtcDays(start, 1) };
  }

  if (filter.mode === "range") {
    const start = makeUtcDate(`${filter.fromISO}T00:00:00.000Z`) ?? utcTodayStart;
    const toDate = makeUtcDate(`${filter.toISO}T00:00:00.000Z`) ?? start;
    return { start, end: addUtcDays(toDate, 1) };
  }

  if (filter.mode === "month") {
    const [yearText, monthText] = filter.monthISO.split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      return { start, end };
    }
    return { start: utcTodayStart, end: addUtcDays(utcTodayStart, 1) };
  }

  const year = Number(filter.year);
  if (!Number.isNaN(year)) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    return { start, end };
  }

  return { start: utcTodayStart, end: addUtcDays(utcTodayStart, 1) };
}

function entityFor(tab: TabKey) {
  return TAB_ENTITY_MAP[tab];
}

export async function queryTopVolumeBy(active: TabKey, filter: DateFilterDTO): Promise<ChartRow[]> {
  const { table, examForeignKey, labelColumn } = entityFor(active);
  const { start, end } = resolveDateRange(filter);

  return examPrisma.$queryRawUnsafe<ChartRow[]>(
    `
      SELECT t."${labelColumn}" AS label, COUNT(e.id)::int AS value
      FROM "Exam" e
      JOIN "${table}" t ON t.id = e."${examForeignKey}"
      WHERE e."startedAt" >= $1 AND e."startedAt" < $2
      GROUP BY t."${labelColumn}"
      ORDER BY value DESC, label ASC
      LIMIT $3
    `,
    start,
    end,
    TOP_LIMIT
  );
}

export async function queryTopOperatingMinutesBy(
  active: TabKey,
  filter: DateFilterDTO
): Promise<ChartRow[]> {
  const { table, examForeignKey, labelColumn } = entityFor(active);
  const { start, end } = resolveDateRange(filter);

  return examPrisma.$queryRawUnsafe<ChartRow[]>(
    `
      SELECT
        t."${labelColumn}" AS label,
        COALESCE(
          SUM(
            GREATEST(
              EXTRACT(EPOCH FROM (COALESCE(e."finishedAt", e."startedAt") - e."startedAt")),
              0
            ) / 60
          ),
          0
        )::int AS value
      FROM "Exam" e
      JOIN "${table}" t ON t.id = e."${examForeignKey}"
      WHERE e."startedAt" >= $1 AND e."startedAt" < $2
      GROUP BY t."${labelColumn}"
      ORDER BY value DESC, label ASC
      LIMIT $3
    `,
    start,
    end,
    TOP_LIMIT
  );
}

export async function queryDrawerBreakdownBy(
  mainTab: TabKey,
  drawerTab: TabKey,
  selected: SelectedBarDTO,
  filter: DateFilterDTO
): Promise<ChartRow[]> {
  const main = entityFor(mainTab);
  const drawer = entityFor(drawerTab);
  const { start, end } = resolveDateRange(filter);

  return examPrisma.$queryRawUnsafe<ChartRow[]>(
    `
      SELECT d."${drawer.labelColumn}" AS label, COUNT(e.id)::int AS value
      FROM "Exam" e
      JOIN "${main.table}" m ON m.id = e."${main.examForeignKey}"
      JOIN "${drawer.table}" d ON d.id = e."${drawer.examForeignKey}"
      WHERE e."startedAt" >= $1
        AND e."startedAt" < $2
        AND m."${main.labelColumn}" = $3
      GROUP BY d."${drawer.labelColumn}"
      ORDER BY value DESC, label ASC
      LIMIT $4
    `,
    start,
    end,
    selected.label,
    TOP_LIMIT
  );
}
