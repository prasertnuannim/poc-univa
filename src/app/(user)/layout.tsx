import { getServerAuthSession } from "@/server/services/auth/sessionService";
import UserProviders from "./providers";
import ToggleButton from "@/components/ui/toggle-button";
import Sidebar from "./sidebar";

export const dynamic = "force-dynamic";

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
      <ToggleButton sidebar={<Sidebar profile={profile} />}>
        {children}
      </ToggleButton>
    </UserProviders>
  );
}
