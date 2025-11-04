/**
 * API Route: Student QR Code
 * GET /api/student/qr?student_id=xxx - Fetch QR code
 * POST /api/student/qr - Generate QR code
 */

import { NextResponse } from 'next/server';
import { getQRCode, saveQRCode, getStudentById, encodeQRData } from '@/lib/api/attendance';
import type { QRCodeData } from '@/types/attendance';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    const qrCode = await getQRCode(studentId);

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found for this student' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        student_id: studentId,
        qr_code: qrCode,
      },
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, qr_code } = body;

    if (!student_id) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await getStudentById(student_id);
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // If QR code data is provided, use it; otherwise generate
    let qrCodeData = qr_code;
    
    if (!qrCodeData) {
      // Generate QR code data
      const qrData: QRCodeData = {
        student_id: student.id,
        name: student.name,
        batch_id: student.batch_id,
        timestamp: new Date().toISOString(),
      };
      qrCodeData = encodeQRData(qrData);
    }

    // Save QR code
    await saveQRCode(student_id, qrCodeData);

    return NextResponse.json({
      success: true,
      data: {
        student_id,
        qr_code: qrCodeData,
      },
      message: 'QR code generated successfully',
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
