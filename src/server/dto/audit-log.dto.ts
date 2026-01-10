type AuditFieldChange = {
  field: string;
  before?: string | number | boolean | null;
  after?: string | number | boolean | null;
};

type AuditLogDetailView = {
  id: string;
  createdAt: Date;
  actor: string;
  module: string;
  action: string;
  target: string;
  targetId?: string | null;
  changes: AuditFieldChange[];
  metadata?: {
    ip?: string;
    reason?: string;
    device?: string;
  };
};
