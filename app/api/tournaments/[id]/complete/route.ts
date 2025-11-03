import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['winnerTeam', 'runnerUpTeam', 'topScorer', 'mvp'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // In a real implementation, this would:
    // 1. Update tournament status to 'completed'
    // 2. Save winner and stats to database
    // 3. Move tournament to past tournaments collection
    
    console.log(`Tournament ${tournamentId} marked as complete:`, body);
    
    return NextResponse.json({
      success: true,
      message: "Tournament marked as completed successfully",
      data: {
        tournamentId,
        ...body,
        status: 'completed',
        completedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error completing tournament:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete tournament" },
      { status: 500 }
    );
  }
}
