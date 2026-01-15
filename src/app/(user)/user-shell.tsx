"use client";

import Sidebar from "./sidebar";
import { Menu } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { TooltipButton } from "@/components/ui/tooltip-button";

type UserProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

export default function UserShell({
  profile,
  children,
}: {
  profile: UserProfile | null;
  children: React.ReactNode;
}) {
  const { toggle } = useSidebar();

  return (
    <div className="flex h-dvh">
      <Sidebar profile={profile} />

      <div className="flex flex-col flex-1">
        <header className="h-14 flex items-center gap-3 px-4 bg-white border-b">
          <TooltipButton
            label="Toggle sidebar"
            onClick={toggle}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <Menu size={20} />
          </TooltipButton>

          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
