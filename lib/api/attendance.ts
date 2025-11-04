/**
 * Attendance Management System - Mock Data and API Utilities
 */

import type {
  Student,
  Coach,
  Session,
  AttendanceRecord,
  AttendanceSummary,
  AttendanceTrend,
  AttendanceSubmission,
  QRCodeData,
} from '@/types/attendance';

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'STU_001',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    batch_id: 'BATCH_001',
    batch_name: 'Morning Batch A',
    enrollment_date: '2024-09-01',
    phone: '+91 9876543210',
  },
  {
    id: 'STU_002',
    name: 'Vivaan Kumar',
    email: 'vivaan.kumar@example.com',
    batch_id: 'BATCH_001',
    batch_name: 'Morning Batch A',
    enrollment_date: '2024-09-01',
    phone: '+91 9876543211',
  },
  {
    id: 'STU_003',
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    batch_id: 'BATCH_001',
    batch_name: 'Morning Batch A',
    enrollment_date: '2024-09-05',
    phone: '+91 9876543212',
  },
  {
    id: 'STU_004',
    name: 'Sai Reddy',
    email: 'sai.reddy@example.com',
    batch_id: 'BATCH_001',
    batch_name: 'Morning Batch A',
    enrollment_date: '2024-09-01',
    phone: '+91 9876543213',
  },
  {
    id: 'STU_005',
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    batch_id: 'BATCH_002',
    batch_name: 'Evening Batch B',
    enrollment_date: '2024-09-01',
    phone: '+91 9876543214',
  },
  {
    id: 'STU_006',
    name: 'Krishna Iyer',
    email: 'krishna.iyer@example.com',
    batch_id: 'BATCH_002',
    batch_name: 'Evening Batch B',
    enrollment_date: '2024-09-01',
    phone: '+91 9876543215',
  },
];

// Mock Coaches
export const mockCoaches: Coach[] = [
  {
    id: 'COACH_001',
    name: 'John Coach',
    email: 'coach@example.com',
    assigned_batches: ['BATCH_001', 'BATCH_002'],
    phone: '+91 9876540001',
  },
  {
    id: 'COACH_002',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    assigned_batches: ['BATCH_002'],
    phone: '+91 9876540002',
  },
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: 'SESSION_2025_11_04_001',
    title: 'Cricket Training - Batting Fundamentals',
    batch_id: 'BATCH_001',
    batch_name: 'Morning Batch A',
    coach_id: 'COACH_001',
    date: '2025-11-04',
    start_time: '08:00',
    end_time: '10:00',
    status: 'ongoing',
  },
  {
    id: 'SESSION_2025_11_04_002',
    title: 'Cricket Training - Bowling Techniques',
    batch_id: 'BATCH_002',
    batch_name: 'Evening Batch B',
    coach_id: 'COACH_001',
    date: '2025-11-04',
    start_time: '16:00',
    end_time: '18:00',
    status: 'scheduled',
  },
  {
    id: 'SESSION_2025_11_03_001',
    title: 'Cricket Training - Fielding Drills',
    batch_id: 'BATCH_001',
    batch_name: 'Morning Batch A',
    coach_id: 'COACH_001',
    date: '2025-11-03',
    start_time: '08:00',
    end_time: '10:00',
    status: 'completed',
  },
];

// Mock Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT_001',
    student_id: 'STU_001',
    student_name: 'Aarav Patel',
    session_id: 'SESSION_2025_11_03_001',
    status: 'present',
    date: '2025-11-03',
    marked_by: 'COACH_001',
    marked_at: '2025-11-03T08:15:00Z',
    method: 'qr',
  },
  {
    id: 'ATT_002',
    student_id: 'STU_002',
    student_name: 'Vivaan Kumar',
    session_id: 'SESSION_2025_11_03_001',
    status: 'present',
    date: '2025-11-03',
    marked_by: 'COACH_001',
    marked_at: '2025-11-03T08:16:00Z',
    method: 'qr',
  },
  {
    id: 'ATT_003',
    student_id: 'STU_003',
    student_name: 'Aditya Sharma',
    session_id: 'SESSION_2025_11_03_001',
    status: 'absent',
    date: '2025-11-03',
    marked_by: 'COACH_001',
    marked_at: '2025-11-03T08:30:00Z',
    method: 'manual',
  },
  {
    id: 'ATT_004',
    student_id: 'STU_004',
    student_name: 'Sai Reddy',
    session_id: 'SESSION_2025_11_03_001',
    status: 'leave',
    date: '2025-11-03',
    marked_by: 'COACH_001',
    marked_at: '2025-11-03T08:17:00Z',
    method: 'manual',
  },
];

// In-memory storage for QR codes
const qrCodeStorage = new Map<string, string>();

/**
 * Get student by ID
 */
export async function getStudentById(studentId: string): Promise<Student | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) return null;

  // Add QR code if available
  return {
    ...student,
    qr_code: qrCodeStorage.get(studentId),
  };
}

/**
 * Get students by batch
 */
export async function getStudentsByBatch(batchId: string): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStudents
    .filter((s) => s.batch_id === batchId)
    .map((student) => ({
      ...student,
      qr_code: qrCodeStorage.get(student.id),
    }));
}

/**
 * Get coach by ID
 */
export async function getCoachById(coachId: string): Promise<Coach | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockCoaches.find((c) => c.id === coachId) || null;
}

/**
 * Get sessions for a coach
 */
export async function getSessionsByCoach(coachId: string, date?: string): Promise<Session[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  let sessions = mockSessions.filter((s) => s.coach_id === coachId);
  
  if (date) {
    sessions = sessions.filter((s) => s.date === date);
  }
  
  return sessions;
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string): Promise<Session | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockSessions.find((s) => s.id === sessionId) || null;
}

/**
 * Save or update QR code for student
 */
export async function saveQRCode(studentId: string, qrCodeData: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  qrCodeStorage.set(studentId, qrCodeData);
  return true;
}

/**
 * Get QR code for student
 */
export async function getQRCode(studentId: string): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return qrCodeStorage.get(studentId) || null;
}

/**
 * Mark attendance
 */
export async function markAttendance(submission: AttendanceSubmission): Promise<AttendanceRecord> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const student = await getStudentById(submission.student_id);
  if (!student) {
    throw new Error('Student not found');
  }

  // Check for duplicate attendance
  const existingRecord = mockAttendanceRecords.find(
    (r) =>
      r.student_id === submission.student_id &&
      r.session_id === submission.session_id
  );

  if (existingRecord) {
    // Update existing record
    existingRecord.status = submission.status;
    existingRecord.marked_at = new Date().toISOString();
    existingRecord.method = submission.method;
    return existingRecord;
  }

  // Create new record
  const newRecord: AttendanceRecord = {
    id: `ATT_${Date.now()}`,
    student_id: submission.student_id,
    student_name: student.name,
    session_id: submission.session_id,
    status: submission.status,
    date: new Date().toISOString().split('T')[0],
    marked_by: submission.marked_by,
    marked_at: new Date().toISOString(),
    method: submission.method,
  };

  mockAttendanceRecords.push(newRecord);
  return newRecord;
}

/**
 * Get attendance records by session
 */
export async function getAttendanceBySession(sessionId: string): Promise<AttendanceRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockAttendanceRecords.filter((r) => r.session_id === sessionId);
}

/**
 * Get attendance records by student
 */
export async function getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockAttendanceRecords.filter((r) => r.student_id === studentId);
}

/**
 * Get attendance summary for student
 */
export async function getAttendanceSummary(studentId: string): Promise<AttendanceSummary> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const records = await getAttendanceByStudent(studentId);
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const leave = records.filter((r) => r.status === 'leave').length;

  return {
    student_id: studentId,
    total_sessions: total,
    attended: present,
    absent,
    leave,
    attendance_percentage: total > 0 ? Math.round((present / total) * 100) : 0,
  };
}

/**
 * Get attendance trend for student (last 30 days)
 */
export async function getAttendanceTrend(studentId: string): Promise<AttendanceTrend[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const records = await getAttendanceByStudent(studentId);
  
  return records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map((r) => ({
      date: r.date,
      status: r.status,
    }));
}

/**
 * Decode QR code data
 */
export function decodeQRData(qrString: string): QRCodeData | null {
  try {
    return JSON.parse(qrString) as QRCodeData;
  } catch {
    return null;
  }
}

/**
 * Encode QR code data
 */
export function encodeQRData(data: QRCodeData): string {
  return JSON.stringify(data);
}
