import {
  findRecordeDataPage,
  type DataRecordsQueryOptions,
} from "../query/dataRecorde.query";
import { mapExamToDataRecord } from "../mappers/dataRecordMapper";
import type { DataRecordRow } from "@/types/data-records.type";

export async function getDataRecords(options: DataRecordsQueryOptions): Promise<{
  data: DataRecordRow[];
  total: number;
}> {
  const { rows, total } = await findRecordeDataPage(options);

  return {
    data: rows.map(mapExamToDataRecord),
    total,
  };
}
