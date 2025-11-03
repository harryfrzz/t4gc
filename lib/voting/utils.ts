/**
 * Voting System Utilities
 * Helper functions for vote tracking, validation, and badge management
 */

import type { Vote, PlayerVoteCount, MatchVotingData, PlayerStats, PlayerBadge } from "./types";

// In-memory storage (replace with database in production)
const votingData = new Map<string, MatchVotingData>();
const playerStats = new Map<string, PlayerStats>();

/**
 * Get voter identifier (IP-based for now, can be extended to session/user-based)
 */
export function getVoterIdentifier(req?: Request): string {
  if (typeof window !== "undefined") {
    // Client-side: use sessionStorage
    let voterId = sessionStorage.getItem("voterId");
    if (!voterId) {
      voterId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("voterId", voterId);
    }
    return voterId;
  }
  
  // Server-side: use IP from headers
  if (req) {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    return `ip-${ip}`;
  }
  
  return `unknown-${Date.now()}`;
}

/**
 * Check if a voter has already voted for a match
 */
export function hasVoted(matchId: string, voterIdentifier: string): boolean {
  const data = votingData.get(matchId);
  if (!data) return false;
  
  return data.votes.some(vote => vote.voterIdentifier === voterIdentifier);
}

/**
 * Submit a vote for a player
 */
export function submitVote(
  matchId: string,
  playerId: string,
  playerName: string,
  team: string,
  role: string,
  voterIdentifier: string
): { success: boolean; message: string; alreadyVoted?: boolean } {
  // Get or create voting data
  let data = votingData.get(matchId);
  
  if (!data) {
    data = {
      matchId,
      matchName: `Match ${matchId}`,
      status: "active",
      votes: [],
      voteCounts: [],
      totalVotes: 0,
      winner: null,
    };
    votingData.set(matchId, data);
  }
  
  // Check voting status
  if (data.status === "closed" || data.status === "completed") {
    return { success: false, message: "Voting for this match has ended", alreadyVoted: false };
  }
  
  // Check if already voted
  if (hasVoted(matchId, voterIdentifier)) {
    return { success: false, message: "You've already voted for this match", alreadyVoted: true };
  }
  
  // Add vote
  const vote: Vote = {
    id: `vote-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    matchId,
    playerId,
    playerName,
    voterIdentifier,
    timestamp: new Date(),
  };
  
  data.votes.push(vote);
  data.totalVotes++;
  
  // Update vote counts
  updateVoteCounts(matchId, playerId, playerName, team, role);
  
  return { success: true, message: "Thank you for voting!" };
}

/**
 * Update vote counts and percentages
 */
function updateVoteCounts(matchId: string, playerId: string, playerName: string, team: string, role: string) {
  const data = votingData.get(matchId);
  if (!data) return;
  
  // Count votes per player
  const counts = new Map<string, PlayerVoteCount>();
  
  data.votes.forEach(vote => {
    if (!counts.has(vote.playerId)) {
      counts.set(vote.playerId, {
        playerId: vote.playerId,
        playerName: vote.playerName,
        team: team,
        role: role,
        voteCount: 0,
        percentage: 0,
      });
    }
    const count = counts.get(vote.playerId)!;
    count.voteCount++;
  });
  
  // Calculate percentages
  counts.forEach(count => {
    count.percentage = data.totalVotes > 0 ? (count.voteCount / data.totalVotes) * 100 : 0;
  });
  
  // Sort by vote count
  data.voteCounts = Array.from(counts.values()).sort((a, b) => b.voteCount - a.voteCount);
}

/**
 * Get voting data for a match
 */
export function getMatchVotingData(matchId: string): MatchVotingData | null {
  return votingData.get(matchId) || null;
}

/**
 * Close voting and determine winner
 */
export function closeVoting(matchId: string): PlayerVoteCount | null {
  const data = votingData.get(matchId);
  if (!data) return null;
  
  data.status = "closed";
  data.closedAt = new Date();
  
  // Determine winner (highest votes)
  if (data.voteCounts.length > 0) {
    data.winner = data.voteCounts[0];
    
    // Award badge to winner
    awardPlayerOfTheMatchBadge(
      data.winner.playerId,
      data.winner.playerName,
      matchId,
      data.matchName,
      data.winner.voteCount,
      data.winner.percentage
    );
    
    data.status = "completed";
  }
  
  return data.winner;
}

/**
 * Award Player of the Match badge
 */
function awardPlayerOfTheMatchBadge(
  playerId: string,
  playerName: string,
  matchId: string,
  matchName: string,
  voteCount: number,
  votePercentage: number
) {
  let stats = playerStats.get(playerId);
  
  if (!stats) {
    stats = {
      playerId,
      playerName,
      potmCount: 0,
      totalVotesReceived: 0,
      badges: [],
    };
    playerStats.set(playerId, stats);
  }
  
  const badge: PlayerBadge = {
    type: "player-of-the-match",
    matchId,
    matchName,
    awardedAt: new Date(),
    voteCount,
    votePercentage,
  };
  
  stats.potmCount++;
  stats.totalVotesReceived += voteCount;
  stats.badges.push(badge);
}

/**
 * Get player stats
 */
export function getPlayerStats(playerId: string): PlayerStats | null {
  return playerStats.get(playerId) || null;
}

/**
 * Get all player stats (for leaderboard)
 */
export function getAllPlayerStats(): PlayerStats[] {
  return Array.from(playerStats.values()).sort((a, b) => b.potmCount - a.potmCount);
}

/**
 * Initialize mock voting data for testing
 */
export function initializeMockVotingData() {
  // Clear existing data
  votingData.clear();
  playerStats.clear();
  
  // Create mock match with some votes
  const mockMatchId = "match-1";
  const mockData: MatchVotingData = {
    matchId: mockMatchId,
    matchName: "Blue Strikers vs Red Raptors",
    status: "active",
    votes: [],
    voteCounts: [],
    totalVotes: 0,
    winner: null,
  };
  
  votingData.set(mockMatchId, mockData);
  
  // Add some initial votes for testing
  const mockVotes = [
    { playerId: "1", playerName: "Alice Smith", team: "Blue Strikers", role: "Player", count: 15 },
    { playerId: "2", playerName: "Bob Johnson", team: "Red Raptors", role: "Coach", count: 8 },
    { playerId: "3", playerName: "Charlie Davis", team: "Blue Strikers", role: "Player", count: 12 },
    { playerId: "5", playerName: "Edward Norton", team: "Red Raptors", role: "Player", count: 20 },
  ];
  
  mockVotes.forEach(({ playerId, playerName, team, role, count }) => {
    for (let i = 0; i < count; i++) {
      submitVote(
        mockMatchId,
        playerId,
        playerName,
        team,
        role,
        `mock-voter-${playerId}-${i}`
      );
    }
  });
}
