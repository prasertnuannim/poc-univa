"use client";

import { useState, type ReactNode, useRef, useEffect } from "react";
import {
  BarChart3,
  Layers,
  ChevronDown,
  Power,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/sidebar-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/LogoutButton";

/* ---------------- TYPES ---------------- */

type SidebarProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

/* ---------------- MAIN ---------------- */

export default function Sidebar({ profile }: { profile: SidebarProfile | null }) {
  const { open } = useSidebar();
  const pathname = usePathname() ?? "";
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);


  const isStatisticsActive =
    pathname === "/statistics" || pathname.startsWith("/statistics");

  const avatarSrc =
    profile?.image && profile.image.trim().length > 0
      ? profile.image
      : "/avatar1.png";

  /* ----- Close popover on outside click ----- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setSubmenuOpen(false);
      }
    }

    if (!open && submenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [submenuOpen, open]);

  return (
    <aside
      className={clsx(
        "h-dvh sticky top-0 z-40 flex flex-col rounded-lg px-3",
        "bg-gray-800 text-white shadow-lg transition-all duration-500",
        open ? "w-64" : "w-20"
      )}
    >

      {/* PROFILE */}
      <div
        className={clsx(
          "flex flex-col items-center",
          open ? "mt-3 mb-6" : "mt-3 mb-5"
        )}
      >
        <Avatar
          className={clsx(
            "border border-white/20 bg-white",
            open ? "h-[70px] w-[70px]" : "h-12 w-12"
          )}
        >
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>
            {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>

        {open && (
          <>
            <h2 className="font-semibold mt-3">
              {profile?.name ?? "Guest"}
            </h2>
            <span className="text-xs text-white/70">
              {profile?.role ?? profile?.email}
            </span>
          </>
        )}
      </div>

      {/* MENU */}
      {open ? (
        <div className="flex flex-col space-y-1">
          <MenuItem
            href="/overview"
            icon={<BarChart3 size={20} />}
            label="Overview"
            active={pathname.startsWith("/overview")}
          />
          <MenuItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname.startsWith("/dashboard")}
          />    
        </div>
      ) : (
        <div className="relative flex flex-col items-center space-y-1 mt-4">
          <IconBtn
            href="/overview"
            icon={<BarChart3 size={22} />}
            active={pathname.startsWith("/overview")}
          />
          <IconBtn
            href="/dashboard"
            icon={<LayoutDashboard size={22} />}
            active={pathname.startsWith("/dashboard")}
          />
        </div>
      )}

      <div className="mt-auto pb-3">
        <LogoutButton
          callbackUrl="/"
          icon={<Power size={20} />}
          showText={open}
          text="Sign Out"
          variant="ghost"
          className={clsx(
            "w-full rounded-xl",
            open ? "justify-start" : "justify-center"
          )}
        />
      </div>
    </aside>
  );
}

function MenuItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-xl",
        "hover:bg-white/20",
        active && "bg-white/30"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function IconBtn({
  icon,
  active,
  href,
}: {
  icon: ReactNode;
  active?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "p-3 rounded-2xl transition",
        active ? "bg-white/30" : "hover:bg-white/20"
      )}
    >
      {icon}
    </Link>
  );
}
