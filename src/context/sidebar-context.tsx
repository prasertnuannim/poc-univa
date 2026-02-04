"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SidebarContextType = {
  open: boolean;
  toggle: () => void;
  setOpen: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  // ✅ auto collapse when < lg
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      setOpen(media.matches); // lg+ = open, <lg = collapsed
    };

    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
