import type { AuditLog } from "@/server/db/auth/prisma/generated/client";
import type { AuditLogRow } from "@/types/audit.type";

export function mapAuditLogToRow(log: AuditLog): AuditLogRow {
  const severity =
    log.action.includes("DELETE") || log.action.includes("FAIL")
      ? "critical"
      : log.action.includes("UPDATE")
      ? "warning"
      : "info";

  return {
    id: log.id,
    createdAt: log.createdAt,
    actor: log.actorLabel ?? log.actorType,
    module: log.module,
    action: log.action,
    target: log.targetType,
    targetId: log.targetId,
    severity,
    before: log.before,
    after: log.after,
  };
}
