/**
 * API Route: List Attendance Records
 * GET /api/attendance/list?session_id=xxx or student_id=xxx
 */

import { NextResponse } from 'next/server';
import { getAttendanceBySession, getAttendanceByStudent } from '@/lib/api/attendance';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const studentId = searchParams.get('student_id');

    if (!sessionId && !studentId) {
      return NextResponse.json(
        { error: 'Either session_id or student_id is required' },
        { status: 400 }
      );
    }

    let records;
    if (sessionId) {
      records = await getAttendanceBySession(sessionId);
    } else if (studentId) {
      records = await getAttendanceByStudent(studentId);
    }

    return NextResponse.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}
