/**
 * API Route: Mark Attendance
 * POST /api/attendance/mark
 */

import { NextResponse } from 'next/server';
import { markAttendance, decodeQRData } from '@/lib/api/attendance';
import type { AttendanceSubmission } from '@/types/attendance';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { student_id, session_id, status, marked_by, method } = body as AttendanceSubmission;

    if (!student_id || !session_id || !status || !marked_by || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['present', 'absent', 'leave'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Validate method
    if (!['qr', 'manual'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid method value' },
        { status: 400 }
      );
    }

    // Mark attendance
    const record = await markAttendance({
      student_id,
      session_id,
      status,
      marked_by,
      method,
    });

    return NextResponse.json({
      success: true,
      data: record,
      message: 'Attendance marked successfully',
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
