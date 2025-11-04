/**
 * API Route: Get Sessions
 * GET /api/attendance/sessions?coach_id=xxx&date=YYYY-MM-DD
 */

import { NextResponse } from 'next/server';
import { getSessionsByCoach, getSessionById } from '@/lib/api/attendance';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coach_id');
    const sessionId = searchParams.get('session_id');
    const date = searchParams.get('date');

    if (sessionId) {
      const session = await getSessionById(sessionId);
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: session,
      });
    }

    if (!coachId) {
      return NextResponse.json(
        { error: 'coach_id is required' },
        { status: 400 }
      );
    }

    const sessions = await getSessionsByCoach(coachId, date || undefined);

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
