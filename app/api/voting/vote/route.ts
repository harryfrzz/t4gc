/**
 * Voting API Endpoint
 * POST /api/voting/vote - Submit a vote
 * GET /api/voting/match/[matchId] - Get voting data for a match
 * POST /api/voting/close - Close voting and determine winner
 */

import { NextRequest, NextResponse } from "next/server";
import {
  submitVote,
  getMatchVotingData,
  closeVoting,
  getVoterIdentifier,
  hasVoted,
} from "@/lib/voting/utils";
import type { VoteRequest, VoteResponse } from "@/lib/voting/types";

// Rate limiting (simple in-memory, replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 10 votes per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT) {
    return false;
  }

  limit.count++;
  return true;
}

/**
 * POST /api/voting/vote
 * Submit a vote for a player
 */
export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json();
    const { matchId, playerId, playerName, team, role } = body;

    // Validation
    if (!matchId || !playerId || !playerName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get voter identifier
    const voterIdentifier = getVoterIdentifier(request);

    // Rate limiting
    if (!checkRateLimit(voterIdentifier)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check if already voted
    if (hasVoted(matchId, voterIdentifier)) {
      const votingData = getMatchVotingData(matchId);
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: "You've already voted for this match",
          alreadyVoted: true,
          voteCounts: votingData?.voteCounts || [],
        },
        { status: 409 }
      );
    }

    // Submit vote
    const result = submitVote(matchId, playerId, playerName, team, role, voterIdentifier);

    if (!result.success) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          message: result.message,
          alreadyVoted: result.alreadyVoted,
        },
        { status: result.alreadyVoted ? 409 : 400 }
      );
    }

    // Get updated vote counts
    const votingData = getMatchVotingData(matchId);

    return NextResponse.json<VoteResponse>({
      success: true,
      message: "Thank you for voting!",
      voteCounts: votingData?.voteCounts || [],
    });
  } catch (error) {
    console.error("Vote submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit vote" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voting/vote
 * Get voting status for a specific match
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");
    const voterCheck = searchParams.get("voterCheck") === "true";

    if (!matchId) {
      return NextResponse.json(
        { success: false, message: "Match ID is required" },
        { status: 400 }
      );
    }

    const votingData = getMatchVotingData(matchId);

    if (!votingData) {
      return NextResponse.json(
        { success: false, message: "No voting data found for this match" },
        { status: 404 }
      );
    }

    // Check if current user has voted
    let hasUserVoted = false;
    if (voterCheck) {
      const voterIdentifier = getVoterIdentifier(request);
      hasUserVoted = hasVoted(matchId, voterIdentifier);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...votingData,
        hasUserVoted,
      },
    });
  } catch (error) {
    console.error("Get voting data error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch voting data" },
      { status: 500 }
    );
  }
}
