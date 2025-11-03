"use client";

import { motion } from "framer-motion";
import { Trophy, Calendar, MapPin, Users, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PastTournament } from "@/types/past-tournaments";

interface TournamentCardProps {
  tournament: PastTournament;
  onClick: () => void;
}

export function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="h-full border-neutral-200/70 dark:border-neutral-800 overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-neutral-900/50">
        <CardHeader className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800/50 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Badge className="mb-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {tournament.year}
              </Badge>
              <CardTitle className="text-lg line-clamp-2">{tournament.name}</CardTitle>
            </div>
            <Trophy className="h-8 w-8 text-amber-500 dark:text-amber-400 flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {/* Winner */}
          <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-md">
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Champion</div>
              <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {tournament.winnerTeam}
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-neutral-600 dark:text-neutral-400">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">
                {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center text-neutral-600 dark:text-neutral-400">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs line-clamp-1">{tournament.location}</span>
            </div>
          </div>

          {/* Tournament Info */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{tournament.totalTeams} Teams</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{tournament.totalMatches} Matches</span>
            </div>
          </div>

          {/* Top Scorer */}
          {tournament.topScorer && (
            <div className="pt-2 border-t dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Top Scorer</div>
              <div className="text-sm font-medium">
                {tournament.topScorer.name}
                <span className="text-neutral-500 dark:text-neutral-400 ml-1">
                  ({tournament.topScorer.goals} goals)
                </span>
              </div>
            </div>
          )}

          {/* View Details */}
          <div className="pt-3 flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View Details →
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
