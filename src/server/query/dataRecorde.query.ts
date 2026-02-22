import { examPrisma } from "@/server/db/exam/client";
import { getThaiDayRange } from "../utils/date";


function buildWhere(options: any) {
  const { q, date, departmentId, deviceId } = options;

  const where: any = {};

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

export async function findRecordeData(options: any) {
  const where = buildWhere(options);

  return examPrisma.exam.findMany({
    skip: options.skip,
    take: options.limit,
    where,
    orderBy: { startedAt: "desc" },
    include: {
      device: true,
      department: true,
      examType: true,
      operator: true,
      physician: true,
    },
  });
}

export async function countExams(options: any) {
  const where = buildWhere(options);
  return examPrisma.exam.count({ where });
}
