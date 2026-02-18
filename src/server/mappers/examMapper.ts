// server/mappers/exam.mapper.ts
import { Exam } from "@/server/domain/exam.entity"
import {
  Exam as PrismaExam,
  ExamStatus as PrismaExamStatus,
} from "@/server/db/exam/prisma/generated/client";
import { ExamStatus } from "@/types/exam";

function toDomainExamStatus(status: PrismaExamStatus): ExamStatus {
  switch (status) {
    case PrismaExamStatus.SCHEDULED:
      return ExamStatus.PENDING
    case PrismaExamStatus.IN_PROGRESS:
      return ExamStatus.IN_PROGRESS
    case PrismaExamStatus.COMPLETED:
      return ExamStatus.COMPLETED
    case PrismaExamStatus.CANCELLED:
      return ExamStatus.PENDING
    default:
      return ExamStatus.PENDING
  }
}

export class ExamMapper {
  static toDomain(raw: PrismaExam): Exam {
    return {
      id: raw.id,
      examTypeId: raw.examTypeId,
      deviceId: raw.deviceId,
      probeId: raw.probeId,
      departmentId: raw.departmentId,
      operatorId: raw.operatorId,
      physicianId: raw.physicianId,
      startedAt: raw.startedAt,
      finishedAt: raw.finishedAt,
      status: toDomainExamStatus(raw.status),
      createdAt: raw.createdAt,
    }
  }
}
