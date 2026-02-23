import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import { auth } from "@/server/services/auth/authService";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POC Univa",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <html
      lang="th"
      className={`${plusJakarta.variable} ${notoThai.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans transition-colors duration-500">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
