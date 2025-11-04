import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - CampusArena",
  description: "Sign in or register for CampusArena",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
