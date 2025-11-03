"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PlayerVotingCard } from "@/components/voting/PlayerVotingCard";
import { VotingResults } from "@/components/voting/VotingResults";
import { Users, Trophy, XCircle } from "lucide-react";
import { initializeMockVotingData, getVoterIdentifier } from "@/lib/voting/utils";
import type { EligiblePlayer, PlayerVoteCount, VoteStatus } from "@/lib/voting/types";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

// Mock players for the match
const mockPlayers: EligiblePlayer[] = [
  { id: "1", name: "Alice Smith", age: 20, gender: "Female", team: "Blue Strikers", role: "Player" },
  { id: "2", name: "Bob Johnson", age: 25, gender: "Male", team: "Red Raptors", role: "Coach" },
  { id: "3", name: "Charlie Davis", age: 22, gender: "Male", team: "Blue Strikers", role: "Player" },
  { id: "5", name: "Edward Norton", age: 28, gender: "Male", team: "Red Raptors", role: "Player" },
  { id: "6", name: "Fiona Apple", age: 23, gender: "Female", team: "Red Raptors", role: "Player" },
  { id: "4", name: "Diana Ross", age: 24, gender: "Female", team: "Blue Strikers", role: "Player" },
];

export default function MatchVotingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matchId] = useState("match-1");
  const [voteCounts, setVoteCounts] = useState<PlayerVoteCount[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votingStatus, setVotingStatus] = useState<VoteStatus>("active");
  const [winner, setWinner] = useState<PlayerVoteCount | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPlayerId, setVotedPlayerId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Redirect event hosters away from voting page
  useEffect(() => {
    if (user?.role === "event-hoster") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockVotingData();
    fetchVotingData();
  }, []);

  const fetchVotingData = async () => {
    try {
      const response = await fetch(`/api/voting/vote?matchId=${matchId}&voterCheck=true`);
      const data = await response.json();

      if (data.success) {
        setVoteCounts(data.data.voteCounts || []);
        setTotalVotes(data.data.totalVotes || 0);
        setVotingStatus(data.data.status);
        setWinner(data.data.winner);
        setHasVoted(data.data.hasUserVoted);

        // Find which player the user voted for
        if (data.data.hasUserVoted) {
          const voterIdentifier = getVoterIdentifier();
          const userVote = data.data.votes?.find(
            (v: any) => v.voterIdentifier === voterIdentifier
          );
          if (userVote) {
            setVotedPlayerId(userVote.playerId);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch voting data:", error);
    }
  };

  const handleVote = async (playerId: string) => {
    if (hasVoted || votingStatus !== "active") {
      toast.error("You've already voted for this match");
      return;
    }

    const player = mockPlayers.find((p) => p.id === playerId);
    if (!player) return;

    setIsVoting(true);

    try {
      const response = await fetch("/api/voting/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          playerId: player.id,
          playerName: player.name,
          team: player.team,
          role: player.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Thank you for voting!", {
          description: `You voted for ${player.name}`,
        });
        setHasVoted(true);
        setVotedPlayerId(playerId);
        setVoteCounts(data.voteCounts || []);
        setTotalVotes((data.voteCounts || []).reduce((sum: number, p: PlayerVoteCount) => sum + p.voteCount, 0));
      } else {
        toast.error(data.message);
        if (data.alreadyVoted) {
          setHasVoted(true);
        }
      }
    } catch (error) {
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCloseVoting = async () => {
    setIsClosing(true);

    try {
      const response = await fetch("/api/voting/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setVotingStatus("completed");
        setWinner(data.winner);
        setVoteCounts(data.votingData.voteCounts || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to close voting");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Player of the Match</h1>
          <p className="text-neutral-600 mt-1">
            Vote for the standout player from Blue Strikers vs Red Raptors
          </p>
        </div>
        {votingStatus === "active" && (
          <Button
            variant="outline"
            onClick={handleCloseVoting}
            disabled={isClosing || totalVotes === 0}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Close Voting
          </Button>
        )}
      </div>

      {/* Status Card */}
      {hasVoted && votingStatus === "active" && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-green-800 font-medium flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Thank you for voting! Check the results below.
            </p>
          </CardContent>
        </Card>
      )}

      {votingStatus === "closed" && (
        <Card className="bg-neutral-50 border-neutral-200">
          <CardContent className="p-4">
            <p className="text-neutral-800 font-medium">
              Voting has ended. Results are being finalized.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="vote" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vote">
            <Users className="h-4 w-4 mr-2" />
            Vote
          </TabsTrigger>
          <TabsTrigger value="results">
            <Trophy className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vote" className="space-y-4">
          {votingStatus === "completed" ? (
            <Card>
              <CardHeader>
                <CardTitle>Voting Closed</CardTitle>
                <CardDescription>
                  This match's voting has ended. Check the results tab to see the winner!
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Cast Your Vote</CardTitle>
                  <CardDescription>
                    Select the player who made the biggest impact in this match
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPlayers.map((player) => (
                  <PlayerVotingCard
                    key={player.id}
                    player={player}
                    onVote={handleVote}
                    hasVoted={votedPlayerId === player.id}
                    isVoting={isVoting}
                    disabled={hasVoted || votingStatus !== "active"}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="results">
          <VotingResults
            voteCounts={voteCounts}
            totalVotes={totalVotes}
            status={votingStatus}
            winner={winner}
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
}
