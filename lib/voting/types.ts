/**
 * Voting System Types
 * Types and interfaces for Player of the Match voting feature
 */

export type VoteStatus = "active" | "closed" | "completed";

export interface Vote {
  id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  voterIdentifier: string; // IP address or session ID
  timestamp: Date;
}

export interface PlayerVoteCount {
  playerId: string;
  playerName: string;
  team: string;
  role: string;
  voteCount: number;
  percentage: number;
}

export interface MatchVotingData {
  matchId: string;
  matchName: string;
  status: VoteStatus;
  votes: Vote[];
  voteCounts: PlayerVoteCount[];
  totalVotes: number;
  winner: PlayerVoteCount | null;
  closedAt?: Date;
}

export interface PlayerBadge {
  type: "player-of-the-match";
  matchId: string;
  matchName: string;
  awardedAt: Date;
  voteCount: number;
  votePercentage: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  potmCount: number; // Player of the Match count
  totalVotesReceived: number;
  badges: PlayerBadge[];
}

export interface VoteRequest {
  matchId: string;
  playerId: string;
  playerName: string;
  team: string;
  role: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  alreadyVoted?: boolean;
  voteCounts?: PlayerVoteCount[];
}

export interface EligiblePlayer {
  id: string;
  name: string;
  team: string;
  role: string;
  age: number;
  gender: string;
}

export interface MatchInfo {
  id: string;
  name: string;
  team1: string;
  team2: string;
  date: string;
  status: "upcoming" | "live" | "completed";
  votingStatus: VoteStatus;
}
