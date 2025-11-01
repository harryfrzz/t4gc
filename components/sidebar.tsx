"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on auth pages or if not authenticated
  if (pathname.startsWith("/auth") || !isAuthenticated) {
    return null;
  }

  const getInitial = () => {
    return user?.name.charAt(0).toUpperCase() || "U";
  };

  return (
    <aside className="w-56 h-screen border-r border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex flex-col p-4 gap-2">
      <div className="mb-8 mt-2 font-bold text-lg tracking-tight">Y-Ultimate</div>
      <nav className="flex flex-col gap-1 flex-1">
        <Link 
          href="/dashboard" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 transition font-medium",
            pathname === "/dashboard" && "bg-neutral-100"
          )}
        >
          Dashboard
        </Link>
        <Link 
          href="/participants" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 transition",
            pathname === "/participants" && "bg-neutral-100"
          )}
        >
          Tournaments
        </Link>
        <Link 
          href="/sponsorship" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 transition",
            pathname === "/sponsorship" && "bg-neutral-100"
          )}
        >
          Sponsorships
        </Link>
        <Link 
          href="/gallery" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 transition",
            pathname === "/gallery" && "bg-neutral-100"
          )}
        >
          Gallery
        </Link>
        <Link 
          href="/past-tournaments" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 transition",
            pathname === "/past-tournaments" && "bg-neutral-100"
          )}
        >
          Past Tournaments
        </Link>
      </nav>
      
      <div className="border-t border-neutral-200 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus:outline-none">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 transition cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {getInitial()}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-neutral-500">{user?.email}</div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Manage Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
