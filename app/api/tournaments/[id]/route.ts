import { NextResponse } from "next/server";
import { getTournamentDetails } from "@/lib/api/past-tournaments";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const tournament = await getTournamentDetails(tournamentId);
    
    if (!tournament) {
      return NextResponse.json(
        { success: false, error: "Tournament not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: tournament
    });
  } catch (error) {
    console.error("Error fetching tournament details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tournament details" },
      { status: 500 }
    );
  }
}
