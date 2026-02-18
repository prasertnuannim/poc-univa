
import { ExamStatus } from "@/types/exam"
import { z } from "zod"


export const createExamSchema = z.object({
  examTypeId: z.string().uuid(),
  deviceId: z.string().uuid(),
  probeId: z.string().uuid().optional(),
  departmentId: z.string().uuid(),
  operatorId: z.string().uuid().optional(),
  physicianId: z.string().uuid().optional(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().optional(),
  status: z.nativeEnum(ExamStatus).optional(),
})
