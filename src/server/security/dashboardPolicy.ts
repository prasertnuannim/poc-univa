export function overviewRateLimitKey(userId?: string | null) {
  return `dashboard:overview:${userId ?? "anon"}`;
}

// ถ้าคุณมี RBAC จริง ค่อยเพิ่ม
export function canViewOverview(role?: string | null) {
  return true; // หรือ role === "ADMIN" เป็นต้น
}
