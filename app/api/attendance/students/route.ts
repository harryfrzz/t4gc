/**
 * API Route: Get Students by Batch
 * GET /api/attendance/students?batch_id=xxx
 */

import { NextResponse } from 'next/server';
import { getStudentsByBatch } from '@/lib/api/attendance';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batch_id');

    if (!batchId) {
      return NextResponse.json(
        { error: 'batch_id is required' },
        { status: 400 }
      );
    }

    const students = await getStudentsByBatch(batchId);

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
