import { AccessRole } from "@/lib/auth/accessRole";

export const ACCESS_RULES: Record<string, AccessRole[]> = {
  "/admin": [AccessRole.Admin],
  "/overview": [AccessRole.Admin, AccessRole.User],
  "/dashboard": [AccessRole.Admin, AccessRole.User],
  "/data-records": [AccessRole.Admin, AccessRole.User],
  "/device-management": [AccessRole.Admin],
};

export function matchProtectedPath(pathname: string): string | undefined {
  return Object.keys(ACCESS_RULES)
    .sort((a, b) => b.length - a.length) // กัน route ซ้อน
    .find(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );
}
