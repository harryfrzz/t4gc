"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { PlayerVoteCount, VoteStatus } from "@/lib/voting/types";

interface VotingResultsProps {
  voteCounts: PlayerVoteCount[];
  totalVotes: number;
  status: VoteStatus;
  winner: PlayerVoteCount | null;
}

export function VotingResults({
  voteCounts,
  totalVotes,
  status,
  winner,
}: VotingResultsProps) {
  if (voteCounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-neutral-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
          <p>No votes yet. Be the first to vote!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Results
          </CardTitle>
          <Badge variant="secondary">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {voteCounts.map((player, index) => {
          const isWinner = status === "completed" && winner?.playerId === player.playerId;
          const isLeading = index === 0 && status === "active";

          return (
            <motion.div
              key={player.playerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                isWinner
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 shadow-md"
                  : isLeading
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {isWinner && (
                    <Trophy className="h-6 w-6 text-yellow-600" fill="currentColor" />
                  )}
                  {!isWinner && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 font-semibold text-sm">
                      #{index + 1}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-neutral-900 flex items-center gap-2">
                      {player.playerName}
                      {isWinner && (
                        <Badge className="bg-yellow-500 text-yellow-950">
                          Player of the Match
                        </Badge>
                      )}
                      {isLeading && !isWinner && (
                        <Badge variant="secondary">Leading</Badge>
                      )}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {player.team} • {player.role}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-neutral-900">
                    {player.voteCount}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {player.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full ${
                    isWinner
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                      : isLeading
                      ? "bg-gradient-to-r from-blue-400 to-blue-600"
                      : "bg-gradient-to-r from-neutral-400 to-neutral-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${player.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}

        {status === "completed" && winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 text-center"
          >
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" fill="currentColor" />
            <p className="font-semibold text-lg text-yellow-900">
              Congratulations {winner.playerName}!
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              Player of the Match with {winner.voteCount} votes ({winner.percentage.toFixed(1)}%)
            </p>
          </motion.div>
        )}

        {status === "closed" && !winner && (
          <div className="mt-6 p-4 bg-neutral-100 rounded-lg text-center text-neutral-600">
            <p>Voting has ended.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
