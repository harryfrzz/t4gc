import { NextResponse } from "next/server";
import { getPastTournaments } from "@/lib/api/past-tournaments";

export async function GET() {
  try {
    const tournaments = await getPastTournaments();
    
    return NextResponse.json({
      success: true,
      data: tournaments,
      count: tournaments.length
    });
  } catch (error) {
    console.error("Error fetching past tournaments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch past tournaments" },
      { status: 500 }
    );
  }
}
