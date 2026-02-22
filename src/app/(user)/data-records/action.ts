"use server";

import { getDataRecords } from "@/server/services/dataRecordsService";
import {
  dataRecordsActionParamsSchema,
  type DataRecordsActionParams,
  type DataRecordsActionQuery,
} from "@/server/schemas/data-records.schema";

function parseDataRecordQuery(params: DataRecordsActionParams | undefined): DataRecordsActionQuery {
  const parsed = dataRecordsActionParamsSchema.safeParse(params ?? {});
  if (parsed.success) return parsed.data;

  // fallback ให้ query ทำงานต่อได้แม้รับ payload ผิดรูปแบบ
  return dataRecordsActionParamsSchema.parse({});
}

function toPagination(page: number, pageSize: number) {
  return {
    skip: (page - 1) * pageSize,
    limit: pageSize,
  };
}

export async function getDataRecordsAction(params?: DataRecordsActionParams) {
  const query = parseDataRecordQuery(params);
  const pagination = toPagination(query.page, query.pageSize);

  return getDataRecords({
    ...pagination,
    q: query.q,
    date: query.date,
    departmentId: query.departmentId,
    deviceId: query.deviceId,
  });
}
