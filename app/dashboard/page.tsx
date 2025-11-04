"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Settings, User, LogOut, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitial = () => {
    return user?.name.charAt(0).toUpperCase() || "U";
  };

  const managementCards = [
    {
      title: "Tournament Management",
      description: "Create, manage and track all tournament activities",
      icon: Trophy,
      href: "/tournaments",
      gradient: "from-blue-500 to-purple-600",
      hoverGradient: "hover:from-blue-600 hover:to-purple-700",
      roles: ["admin", "teacher", "user", "student"]
    },
    {
      title: "Class Management",
      description: "Manage classes, assignments, attendance and exams",
      icon: Users,
      href: "/coaching",
      gradient: "from-green-500 to-teal-600",
      hoverGradient: "hover:from-green-600 hover:to-teal-700",
      roles: ["admin", "teacher", "student"]
    },
    {
      title: "Access Control",
      description: "Manage user permissions and access levels",
      icon: Shield,
      href: "/access-control",
      gradient: "from-orange-500 to-red-600",
      hoverGradient: "hover:from-orange-600 hover:to-red-700",
      roles: ["admin"]
    }
  ];

  const userCards = managementCards.filter(card => 
    card.roles.includes(user?.role || "user")
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              campusarena
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {user?.role === "admin" ? "Admin" : user?.role === "teacher" ? "Teacher" : "Student"}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {getInitial()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</div>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-3">Welcome back, {user?.name}!</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Select a management area to get started
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
        {userCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card 
                className="cursor-pointer h-full border-2 hover:shadow-xl transition-all duration-200 overflow-hidden group"
                onClick={() => router.push(card.href)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} ${card.hoverGradient} flex items-center justify-center mb-4 transition-all duration-200`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{card.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    Get Started
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
}