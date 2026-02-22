import { examPrisma } from "@/server/db/exam/client";
import type { Prisma } from "@/server/db/exam/prisma/generated/client";
import { getThaiDayRange } from "../utils/date";

type DataRecordsFilterOptions = {
  q?: string;
  date?: string;
  departmentId?: string;
  deviceId?: string;
};

export type DataRecordsQueryOptions = DataRecordsFilterOptions & {
  skip?: number;
  limit?: number;
};

const EXAM_RELATION_INCLUDE = {
  device: true,
  department: true,
  examType: true,
  operator: true,
  physician: true,
} satisfies Prisma.ExamInclude;

export type DataRecordExamEntity = Prisma.ExamGetPayload<{
  include: typeof EXAM_RELATION_INCLUDE;
}>;

function toPagination(options: DataRecordsQueryOptions) {
  const rawSkip = Number.isFinite(options.skip) ? Number(options.skip) : 0;
  const rawLimit = Number.isFinite(options.limit) ? Number(options.limit) : 10;

  const skip = Math.max(0, Math.trunc(rawSkip));
  const limit = Math.min(100, Math.max(1, Math.trunc(rawLimit)));

  return { skip, limit };
}

function buildWhere(options: DataRecordsFilterOptions): Prisma.ExamWhereInput {
  const { q, date, departmentId, deviceId } = options;

  const where: Prisma.ExamWhereInput = {};

  if (date) {
    const { startUTC, endUTC } = getThaiDayRange(date);
    where.startedAt = { gte: startUTC, lte: endUTC };
  }

  if (departmentId) where.departmentId = departmentId;
  if (deviceId) where.deviceId = deviceId;

  if (q) {
    where.OR = [
      { device: { name: { contains: q, mode: "insensitive" } } },
      { department: { name: { contains: q, mode: "insensitive" } } },
      { examType: { name: { contains: q, mode: "insensitive" } } },
      { operator: { fullName: { contains: q, mode: "insensitive" } } },
      { physician: { fullName: { contains: q, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function findRecordeData(options: DataRecordsQueryOptions): Promise<DataRecordExamEntity[]> {
  const where = buildWhere(options);
  const { skip, limit } = toPagination(options);

  return examPrisma.exam.findMany({
    skip,
    take: limit,
    where,
    orderBy: { startedAt: "desc" },
    include: EXAM_RELATION_INCLUDE,
  });
}

export async function countExams(options: DataRecordsFilterOptions): Promise<number> {
  const where = buildWhere(options);
  return examPrisma.exam.count({ where });
}

export async function findRecordeDataPage(options: DataRecordsQueryOptions): Promise<{
  rows: DataRecordExamEntity[];
  total: number;
}> {
  const where = buildWhere(options);
  const { skip, limit } = toPagination(options);

  const [rows, total] = await examPrisma.$transaction([
    examPrisma.exam.findMany({
      skip,
      take: limit,
      where,
      orderBy: { startedAt: "desc" },
      include: EXAM_RELATION_INCLUDE,
    }),
    examPrisma.exam.count({ where }),
  ]);

  return { rows, total };
}
