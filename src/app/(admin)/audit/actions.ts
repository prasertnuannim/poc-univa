// src/app/(admin)/audit-logs/actions.ts
"use server";

import { getAuditLogs } from "@/server/services/auditLogService";

export async function getAuditLogsAction() {
  const logs = await getAuditLogs({ limit: 100 });
  return logs;
}
