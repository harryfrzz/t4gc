"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { EligiblePlayer } from "@/lib/voting/types";

interface PlayerVotingCardProps {
  player: EligiblePlayer;
  onVote: (playerId: string) => void;
  hasVoted: boolean;
  isVoting: boolean;
  disabled: boolean;
}

export function PlayerVotingCard({
  player,
  onVote,
  hasVoted,
  isVoting,
  disabled,
}: PlayerVotingCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  const handleVote = () => {
    setShowConfetti(true);
    onVote(player.id);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="relative"
    >
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarColor(
                  player.name
                )} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
              >
                {getInitials(player.name)}
              </div>

              {/* Confetti animation */}
              <AnimatePresence>
                {showConfetti && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                        style={{
                          background: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"][
                            i % 4
                          ],
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI) / 4) * 60,
                          y: Math.sin((i * Math.PI) / 4) * 60,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Player Info */}
            <div className="text-center w-full">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {player.name}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">{player.team}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{player.role}</p>
            </div>

            {/* Vote Button */}
            <Button
              onClick={handleVote}
              disabled={disabled || isVoting}
              className={`w-full ${
                hasVoted
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              }`}
            >
              <motion.div
                animate={isVoting ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <Heart
                  className="h-4 w-4"
                  fill={hasVoted ? "currentColor" : "none"}
                />
                {hasVoted ? "Voted!" : "Vote"}
              </motion.div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
