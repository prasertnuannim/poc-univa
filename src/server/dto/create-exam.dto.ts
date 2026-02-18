import { ExamStatus } from "@/types/exam"


export type CreateExamDTO = {
  examTypeId: string
  deviceId: string
  probeId?: string
  departmentId: string
  operatorId?: string
  physicianId?: string
  startedAt: string
  finishedAt?: string
  status?: ExamStatus
}
