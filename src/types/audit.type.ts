import type { Prisma } from "@/server/db/auth/prisma/generated/client";

export type AuditLogRow = {
  id: string;
  createdAt: Date;
  actor: string;
  module: string;
  action: string;
  target: string;
  targetId?: string | null;
  severity: "critical" | "warning" | "info";
  before?: Prisma.JsonValue | null;
  after?: Prisma.JsonValue | null;
};
