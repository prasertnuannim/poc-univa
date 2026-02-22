import type { DataRecordExamEntity } from "@/server/query/dataRecorde.query";
import type { DataRecordRow } from "@/types/data-records.type";
import { toThaiDate } from "../utils/date";

export function mapExamToDataRecord(record: DataRecordExamEntity): DataRecordRow {
  const finishedAt = record.finishedAt ?? record.startedAt;

  const durationMinutes = Math.max(
    0,
    Math.round(
      (finishedAt.getTime() - record.startedAt.getTime()) / 60000
    )
  );

  return {
    id: record.id,
    date: toThaiDate(record.startedAt),
    device: record.device.name,
    unit: record.department.name,
    examType: record.examType.name,
    operator: record.operator?.fullName ?? "-",
    physician: record.physician?.fullName ?? "-",
    status: record.status,
    duration: durationMinutes,
  };
}
