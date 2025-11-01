import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Y-Ultimate",
  description: "Sign in or register for Y-Ultimate",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
