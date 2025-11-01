"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <div className="bg-gradient-to-br from-neutral-50 to-white min-h-screen">{children}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-white min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
