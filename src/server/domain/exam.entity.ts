import { ExamStatus } from "@/types/exam"

export interface Exam {
  id: string
  examTypeId: string
  deviceId: string
  probeId?: string | null
  departmentId: string
  operatorId?: string | null
  physicianId?: string | null
  startedAt: Date
  finishedAt?: Date | null
  status: ExamStatus
  createdAt: Date
}
