export enum AuditActorType {
  USER = "USER",
  SYSTEM = "SYSTEM",
  DEVICE = "DEVICE",
  SERVICE = "SERVICE",
}

export enum AuditModule {
  ACCOUNT = "ACCOUNT",
  ORDER = "ORDER",
  OEE = "OEE",
  SENSOR = "SENSOR",
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN_FAIL = "LOGIN_FAIL",
  DATA_RECEIVED = "DATA_RECEIVED",
}
