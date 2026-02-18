import { findRecordeData, countExams } from "../query/dataRecordeQuery";
import { mapExamToDataRecord } from "../mappers/dataRecordMapper";
import type { DataRecordRow } from "@/types/data-records.type";

type Options = {
  skip: number;
  limit: number;
  q?: string;
  date?: string;
  departmentId?: string;
  deviceId?: string;
};

export async function getDataRecords(options: Options): Promise<{
  data: DataRecordRow[];
  total: number;
}> {
  const [data, total] = await Promise.all([
    findRecordeData(options),
    countExams(options),
  ]);
console.log("Data Records:", data);
  return {
    data: data.map(mapExamToDataRecord),
    total,
  };
}
