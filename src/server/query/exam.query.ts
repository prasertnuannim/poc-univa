import { examPrisma } from "@/server/db/exam/client";

export async function getExamCountByDate(start: Date, end: Date) {
  return examPrisma.exam.count({
    where: {
      startedAt: {
        gte: start,
        lt: end,
      },
    },
  })
}
