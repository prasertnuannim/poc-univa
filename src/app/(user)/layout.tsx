import { getServerAuthSession } from "@/server/services/auth/sessionService";
import UserProviders from "./providers";
import UserShell from "./user-shell";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  const profile = session?.user
    ? {
        name: session.user.name ?? "User",
        email: session.user.email ?? null,
        role: session.user.role ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <UserProviders>
      <UserShell profile={profile}>
        {children}
      </UserShell>
    </UserProviders>
  );
}
