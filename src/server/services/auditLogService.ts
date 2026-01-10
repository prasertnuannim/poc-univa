// server/services/auditLogService.ts
import { prisma } from "@/server/db/auth/client";
import { Prisma } from "@/server/db/auth/prisma/generated/client";
import {
  AuditActorType,
  AuditAction,
  AuditModule,
} from "@/server/constants/audit";

/* =====================
   TYPES
===================== */

export type AuditLogInput = {
  actorId?: string | null;
  actorType: AuditActorType;
  actorLabel?: string | null;

  module: AuditModule;
  action: AuditAction;

  targetType: string;
  targetId?: string | null;

  before?: Prisma.InputJsonValue | null;
  after?: Prisma.InputJsonValue | null;
  metadata?: Prisma.InputJsonValue | null;
};

export type AuditLogTableRow = {
  id: string;
  createdAt: Date;
  actor: string;
  module: AuditModule;
  action: AuditAction;
  target: string;
  targetId?: string | null;
  severity: "critical" | "warning" | "info";
};

/* =====================
   HELPERS
===================== */

const toPrismaJson = (
  value?: Prisma.InputJsonValue | null,
) => {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value;
};

const severityMap: Record<
  AuditAction,
  "critical" | "warning" | "info"
> = {
  DELETE: "critical",
  LOGIN_FAIL: "critical",
  UPDATE: "warning",
  CREATE: "info",
  DATA_RECEIVED: "info",
};

const isAuditModule = (module: string): module is AuditModule =>
  Object.values(AuditModule).includes(module as AuditModule);

const isAuditAction = (action: string): action is AuditAction =>
  Object.values(AuditAction).includes(action as AuditAction);

/* =====================
   SERVICE
===================== */

export const auditLogService = {
  /* WRITE */
  async log(input: AuditLogInput) {
    try {
      await prisma.auditLog.create({
        data: {
          ...input,
          before: toPrismaJson(input.before),
          after: toPrismaJson(input.after),
          metadata: toPrismaJson(input.metadata),
        },
      });
    } catch (e) {
      console.error("AuditLog failed", e);
    }
  },

  /* READ : table */
  async listForTable(take = 50): Promise<AuditLogTableRow[]> {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        createdAt: true,
        actorLabel: true,
        actorType: true,
        module: true,
        action: true,
        targetType: true,
        targetId: true,
      },
    });

    return logs.map((l) => {
      const resolvedModule = isAuditModule(l.module)
        ? l.module
        : AuditModule.ACCOUNT;
      const action = isAuditAction(l.action) ? l.action : AuditAction.CREATE;

      return {
        id: l.id,
        createdAt: l.createdAt,
        actor: l.actorLabel ?? l.actorType,
        module: resolvedModule,
        action,
        target: l.targetType,
        targetId: l.targetId,
        severity: severityMap[action] ?? "info",
      };
    });
  },
};


export async function getAuditLogs(params?: {
  module?: string;
  actorId?: string;
  targetType?: string;
  limit?: number;
}) {
  return prisma.auditLog.findMany({
    where: {
      module: params?.module,
      actorId: params?.actorId,
      targetType: params?.targetType,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: params?.limit ?? 50,
  });
}
