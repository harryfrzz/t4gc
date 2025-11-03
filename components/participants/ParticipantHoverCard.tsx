"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Briefcase, Calendar, User as UserIcon } from "lucide-react";
import { PlayerOfTheMatchBadge } from "@/components/voting/PlayerOfTheMatchBadge";
import { getPlayerStats } from "@/lib/voting/utils";
import type { Participant } from "./ParticipantsModule";

interface ParticipantHoverCardProps {
  participant: Participant;
  children: React.ReactNode;
}

export function ParticipantHoverCard({ participant, children }: ParticipantHoverCardProps) {
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get player stats for badges
  const playerStats = getPlayerStats(participant.id);

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80" 
        align="start"
        side="right"
      >
        <div className="space-y-4">
          {/* Header with Avatar and Name */}
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(
                participant.name
              )} flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0`}
            >
              {getInitials(participant.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {participant.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge
                  variant={participant.status === "Approved" ? "default" : "secondary"}
                  className={
                    participant.status === "Approved"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }
                >
                  {participant.status}
                </Badge>
                {playerStats && playerStats.potmCount > 0 && (
                  <PlayerOfTheMatchBadge 
                    count={playerStats.potmCount} 
                    showCount={true}
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200" />

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <div>
                <span className="text-neutral-500">Team:</span>{" "}
                <span className="font-medium text-neutral-900">{participant.team}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <div>
                <span className="text-neutral-500">Role:</span>{" "}
                <span className="font-medium text-neutral-900">{participant.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <div className="truncate">
                <span className="text-neutral-500">Email:</span>{" "}
                <a
                  href={`mailto:${participant.contact}`}
                  className="font-medium text-blue-600 hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {participant.contact}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <div>
                <span className="text-neutral-500">Age:</span>{" "}
                <span className="font-medium text-neutral-900">{participant.age} years</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <UserIcon className="h-4 w-4 text-neutral-500 flex-shrink-0" />
              <div>
                <span className="text-neutral-500">Gender:</span>{" "}
                <span className="font-medium text-neutral-900">{participant.gender}</span>
              </div>
            </div>
          </div>

          {/* Optional: View Full Profile Link */}
          {/* <div className="border-t border-neutral-200 pt-3">
            <button
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline w-full text-left"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to full profile or open detail modal
              }}
            >
              View Full Profile →
            </button>
          </div> */}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
