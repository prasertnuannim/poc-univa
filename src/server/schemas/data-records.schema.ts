import { z } from "zod";

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

export const dataRecordsActionParamsSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    q: optionalTrimmedString,
    date: optionalTrimmedString,
    departmentId: optionalTrimmedString,
    deviceId: optionalTrimmedString,
  })
  .strict();

export type DataRecordsActionParams = z.input<typeof dataRecordsActionParamsSchema>;
export type DataRecordsActionQuery = z.output<typeof dataRecordsActionParamsSchema>;
