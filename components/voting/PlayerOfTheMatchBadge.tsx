"use client";

import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface PlayerOfTheMatchBadgeProps {
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlayerOfTheMatchBadge({
  count = 1,
  showCount = true,
  size = "md",
  className = "",
}: PlayerOfTheMatchBadgeProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (!showCount) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        title="Player of the Match"
      >
        <Trophy className={`${sizeClasses[size]} text-yellow-500`} fill="currentColor" />
      </span>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={`bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-900 ${className}`}
      title={`${count} Player of the Match ${count === 1 ? "Award" : "Awards"}`}
    >
      <Trophy className={`${sizeClasses[size]} mr-1`} fill="currentColor" />
      {count}
    </Badge>
  );
}
