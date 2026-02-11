
import { examPrisma } from "@/server/db/exam/client";
import { ExamStatus as PrismaExamStatus } from "@/server/db/exam/prisma/generated/client";
import { CreateExamDTO } from "@/server/dto/create-exam.dto"
import { ExamMapper } from "@/server/mappers/exam.mapper"
import { ExamStatus } from "@/types/exam"

function toPrismaExamStatus(status: ExamStatus): PrismaExamStatus {
  switch (status) {
    case ExamStatus.PENDING:
      return PrismaExamStatus.SCHEDULED
    case ExamStatus.IN_PROGRESS:
      return PrismaExamStatus.IN_PROGRESS
    case ExamStatus.COMPLETED:
      return PrismaExamStatus.COMPLETED
    default:
      return PrismaExamStatus.COMPLETED
  }
}

export async function createExam(dto: CreateExamDTO) {
  const exam = await examPrisma.exam.create({
    data: {
      examTypeId: dto.examTypeId,
      deviceId: dto.deviceId,
      probeId: dto.probeId ?? null,
      departmentId: dto.departmentId,
      operatorId: dto.operatorId ?? null,
      physicianId: dto.physicianId ?? null,
      startedAt: new Date(dto.startedAt),
      finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : null,
      status: dto.status
        ? toPrismaExamStatus(dto.status)
        : PrismaExamStatus.COMPLETED,
    },
  })

  return ExamMapper.toDomain(exam)
}
