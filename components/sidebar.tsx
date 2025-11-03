"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, Settings, Plus, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { t } = useTranslation();
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
    <aside className="w-56 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 flex flex-col p-4 gap-2 overflow-y-auto">
      <div className="mb-4 mt-2 font-bold text-lg tracking-tight">{t('sidebar.appName')}</div>
      
      {user?.role === "event-hoster" && (
        <Button 
          onClick={() => router.push('/tournaments/create')} 
          className="w-full mb-4"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('sidebar.newTournament')}
        </Button>
      )}
      
      <nav className="flex flex-col gap-1 flex-1">
        <Link 
          href="/dashboard" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
            (pathname === "/dashboard" || pathname.startsWith("/tournaments")) && "bg-neutral-100 dark:bg-neutral-800 font-medium"
          )}
        >
          {t('sidebar.tournaments')}
        </Link>
        <Link 
          href="/forms" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 transition flex items-center gap-2",
            pathname.startsWith("/forms") && "bg-neutral-100 font-medium"
          )}
        >
          <FileText className="h-4 w-4" />
          {t('sidebar.forms')}
        </Link>
        {user?.role === "event-hoster" && (
          <Link 
            href="/sponsorship" 
            className={cn(
              "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
              pathname === "/sponsorship" && "bg-neutral-100 dark:bg-neutral-800 font-medium"
            )}
          >
            {t('sidebar.sponsorships')}
          </Link>
        )}
        <Link 
          href="/gallery" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
            pathname === "/gallery" && "bg-neutral-100 dark:bg-neutral-800 font-medium"
          )}
        >
          {t('sidebar.gallery')}
        </Link>
        {user?.role !== "event-hoster" && (
          <Link 
            href="/voting" 
            className={cn(
              "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
              pathname === "/voting" && "bg-neutral-100 dark:bg-neutral-800 font-medium"
            )}
          >
            Fan Voting
          </Link>
        )}
        {user?.role === "user" && (
          <Link 
            href="/fixtures" 
            className={cn(
              "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
              pathname === "/fixtures" && "bg-neutral-100 dark:bg-neutral-800 font-medium"
            )}
          >
            {t('sidebar.myFixtures')}
          </Link>
        )}
        <Link 
          href="/past-tournaments" 
          className={cn(
            "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
            pathname === "/past-tournaments" && "bg-neutral-100 dark:bg-neutral-800 font-medium"
          )}
        >
          {t('sidebar.pastTournaments')}
        </Link>
      </nav>
      
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus:outline-none">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {getInitial()}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('sidebar.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              {t('sidebar.manageProfile')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              {t('sidebar.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('sidebar.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}