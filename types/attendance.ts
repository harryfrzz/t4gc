/**
 * Attendance Management System Types
 * Supports QR-based and manual attendance tracking
 */

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export type UserRole = 'user' | 'admin' | 'coach' | 'student';

/**
 * Student information with QR code
 */
export interface Student {
  id: string;
  name: string;
  email: string;
  batch_id: string;
  batch_name: string;
  qr_code?: string; // Base64 or URL
  enrollment_date: string;
  phone?: string;
  avatar?: string;
}

/**
 * Coach information
 */
export interface Coach {
  id: string;
  name: string;
  email: string;
  assigned_batches: string[];
  phone?: string;
  avatar?: string;
}

/**
 * Training session
 */
export interface Session {
  id: string;
  title: string;
  batch_id: string;
  batch_name: string;
  coach_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

/**
 * Attendance record
 */
export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  session_id: string;
  status: AttendanceStatus;
  date: string;
  marked_by: string; // Coach ID
  marked_at: string; // Timestamp
  method: 'qr' | 'manual';
}

/**
 * QR code data structure
 */
export interface QRCodeData {
  student_id: string;
  name: string;
  batch_id: string;
  timestamp?: string;
}

/**
 * Attendance submission payload
 */
export interface AttendanceSubmission {
  student_id: string;
  session_id: string;
  status: AttendanceStatus;
  marked_by: string;
  method: 'qr' | 'manual';
}

/**
 * Attendance summary for student
 */
export interface AttendanceSummary {
  student_id: string;
  total_sessions: number;
  attended: number;
  absent: number;
  leave: number;
  attendance_percentage: number;
}

/**
 * Attendance trend data point
 */
export interface AttendanceTrend {
  date: string;
  status: AttendanceStatus;
}

/**
 * Batch roster for manual attendance
 */
export interface BatchRoster {
  batch_id: string;
  batch_name: string;
  students: Student[];
  session?: Session;
}

/**
 * Attendance export data
 */
export interface AttendanceExport {
  session_id: string;
  session_title: string;
  date: string;
  records: AttendanceRecord[];
  summary: {
    total: number;
    present: number;
    absent: number;
    leave: number;
  };
}
