"use client";

import { useState, type ReactNode, useRef, useEffect } from "react";
import {
  BarChart3,
  Power,
  LayoutDashboard,
  FileText,
  Wrench,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/sidebar-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AnimatePresence, motion, Variants } from "framer-motion";

/* ---------------- TYPES ---------------- */

type SidebarProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

/* ---------------- MAIN ---------------- */

export default function Sidebar({
  profile,
}: {
  profile: SidebarProfile | null;
}) {
  const { open } = useSidebar();
  const pathname = usePathname() ?? "";
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

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
    <motion.aside
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={clsx(
        "h-dvh sticky top-0 z-40 flex flex-col rounded-lg px-3",
        "bg-gray-800 text-white shadow-lg",
      )}
    >
      {/* PROFILE */}
      <div
        className={clsx(
          "flex flex-col items-center",
          open ? "mt-3 mb-6" : "mt-3 mb-5",
        )}
      >
        <Avatar
          className={clsx(
            "border border-white/20 bg-white",
            open ? "h-[70px] w-[70px]" : "h-12 w-12",
          )}
        >
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>
            {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center mt-3 mb-6"
            >
              <h2 className="font-semibold mt-3">{profile?.name ?? "Guest"}</h2>
              <span className="text-xs text-white/70">
                {profile?.role ?? profile?.email}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MENU */}
      <AnimatePresence></AnimatePresence>
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
          <MenuItem
            href="/data-records"
            icon={<FileText size={20} />}
            label="Data Records"
            active={pathname.startsWith("/data-records")}
          />
          <MenuItem
            href="/device-maintenance"
            icon={<Wrench size={20} />}
            label="Device Maintenance"
            active={pathname.startsWith("/device-maintenance")}
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
          <IconBtn
            href="/data-records"
            icon={<FileText size={22} />}
            active={pathname.startsWith("/data-records")}
          />
          <IconBtn
            href="/device-maintenance"
            icon={<Wrench size={22} />}
            active={pathname.startsWith("/device-maintenance")}
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
            open ? "justify-start" : "justify-center",
          )}
        />
      </div>
    </motion.aside>
  );
}
const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut", // ✅ FIX
    },
  },
  exit: { opacity: 0, x: -12 },
};

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
    <motion.div
      variants={menuItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        href={href}
        className={clsx(
          "flex items-center gap-3 px-3 py-2 rounded-xl relative",
          "hover:bg-white/20",
          active && "bg-white/30",
        )}
      >
        {icon}
        <span>{label}</span>

        {/* Active indicator */}
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white"
          />
        )}
      </Link>
    </motion.div>
  );
}

const MotionLink = motion.create(Link);
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
   
<MotionLink
  href={href}
  whileHover={{ scale: 1.12 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 420, damping: 26 }}
  className={clsx(
    "mt-1 p-2 rounded-md transition-colors relative",
    active ? "bg-white/30" : "hover:bg-white/20",
  )}
>
  {icon}
</MotionLink>
  );
}
