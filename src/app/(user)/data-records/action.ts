"use server";

import { getDataRecords } from "@/server/services/dataRecordsService";


export async function getDataRecordsAction(params: {
  page?: number;
  pageSize?: number;
  q?: string;
  date?: string;
  departmentId?: string;
  deviceId?: string;
}) {
  const {
    page = 1,
    pageSize = 10,
    q,
    date,
    departmentId,
    deviceId,
  } = params;

  const skip = (page - 1) * pageSize;

  return getDataRecords({
    skip,
    limit: pageSize,
    q,
    date,
    departmentId,
    deviceId,
  });
}
