/**
 * Close Voting API Endpoint
 * POST /api/voting/close - Close voting for a match and determine winner
 */

import { NextRequest, NextResponse } from "next/server";
import { closeVoting, getMatchVotingData } from "@/lib/voting/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId } = body;

    if (!matchId) {
      return NextResponse.json(
        { success: false, message: "Match ID is required" },
        { status: 400 }
      );
    }

    // TODO: Add admin authentication check here
    // For now, anyone can close voting (add auth in production)

    const winner = closeVoting(matchId);
    const votingData = getMatchVotingData(matchId);

    if (!votingData) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: winner
        ? `Voting closed. ${winner.playerName} wins Player of the Match!`
        : "Voting closed with no votes",
      winner,
      votingData,
    });
  } catch (error) {
    console.error("Close voting error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to close voting" },
      { status: 500 }
    );
  }
}
