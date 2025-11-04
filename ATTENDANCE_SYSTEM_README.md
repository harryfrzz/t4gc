# Attendance Management System - Installation & Usage Guide

## Overview
Complete attendance management system for coaching programs with QR-based and manual attendance marking capabilities.

## Features Implemented

### ✅ Authentication & Role Management
- Extended auth context with `coach` and `student` roles
- Test credentials:
  - **Coach**: `coach@example.com` / `coach123`
  - **Student**: `student@example.com` / `student123`

### ✅ QR Code Generation (Student)
- Auto-generates unique QR code on first login
- Stores QR code data (student_id, name, batch_id)
- Download QR code as PNG image
- Displays on student dashboard

### ✅ Attendance Marking (Coach)
Two modes available:

#### QR Scan Mode
- Camera-based QR code scanner
- Real-time student identification
- Auto-marks attendance as "Present"
- Prevents duplicate scans
- Success notifications

#### Manual Entry Mode
- View full batch roster
- Toggle status: Present / Absent / Leave
- Auto-filled current date
- Bulk submission
- Real-time summary (counts)

### ✅ Dashboard Views

#### Student Dashboard (`/student/dashboard`)
- Personal QR code display with download
- Attendance summary cards:
  - Total sessions
  - Attendance percentage
  - Performance badge
- Attendance trend chart (last 30 sessions)

#### Coach Dashboard (`/coach/attendance`)
- Session selection (today's sessions)
- Toggle between QR Scan and Manual modes
- Session details display
- Quick statistics

### ✅ API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/attendance/mark` | POST | Mark attendance for a student |
| `/api/attendance/list` | GET | Get attendance records (by session or student) |
| `/api/student/qr` | GET | Fetch student's QR code |
| `/api/student/qr` | POST | Generate new QR code |
| `/api/attendance/sessions` | GET | Get sessions for coach |
| `/api/attendance/students` | GET | Get students by batch |

### ✅ Data Models
- **Student**: ID, name, email, batch, QR code
- **Coach**: ID, name, assigned batches
- **Session**: ID, title, batch, coach, date, time, status
- **AttendanceRecord**: student, session, status, date, marked_by, method

## Installation Steps

### 1. Install Dependencies

```bash
npm install qrcode react-qr-code html5-qrcode @types/qrcode
```

### 2. File Structure Created

```
app/
├── student/
│   └── dashboard/
│       └── page.tsx (Student dashboard)
├── coach/
│   └── attendance/
│       └── page.tsx (Coach attendance marking)
├── api/
│   ├── attendance/
│   │   ├── mark/route.ts (Mark attendance)
│   │   ├── list/route.ts (List records)
│   │   ├── sessions/route.ts (Get sessions)
│   │   └── students/route.ts (Get students)
│   └── student/
│       └── qr/route.ts (QR code generation/retrieval)

components/
└── attendance/
    ├── QRCodeDisplay.tsx (Student QR display)
    ├── QRScanner.tsx (Coach QR scanner)
    └── ManualAttendanceForm.tsx (Roster-based entry)

lib/
└── api/
    └── attendance.ts (Mock data & utilities)

types/
└── attendance.ts (TypeScript interfaces)

locales/
├── en.json (English translations - COMPLETE)
└── es.json (Spanish translations - COMPLETE)
```

### 3. Mock Data Available
- 6 students across 2 batches
- 2 coaches
- 3 training sessions
- Sample attendance records

## Usage Guide

### For Students

1. **Login**
   - Email: `student@example.com`
   - Password: `student123`

2. **View Dashboard**
   - Navigate to `/student/dashboard`
   - QR code auto-generates on first visit
   - Download QR code for printing
   - View attendance summary and trends

### For Coaches

1. **Login**
   - Email: `coach@example.com`
   - Password: `coach123`

2. **Mark Attendance**
   - Navigate to `/coach/attendance`
   - Select today's session
   - Choose marking method:

   **QR Scan:**
   - Click "Start Scanning"
   - Allow camera access
   - Scan student QR codes
   - Attendance auto-marked

   **Manual Entry:**
   - View full roster
   - Select status for each student
   - Click "Submit Attendance"

## Security & Validation

✅ Prevents duplicate attendance (same student, same session)
✅ Validates QR code format before processing
✅ Auto-fills date (server-side timestamp)
✅ Coach can only mark for assigned sessions
✅ QR codes encoded with JSON data

## API Request Examples

### Mark Attendance (QR)
```json
POST /api/attendance/mark
{
  "student_id": "STU_001",
  "session_id": "SESSION_2025_11_04_001",
  "status": "present",
  "marked_by": "COACH_001",
  "method": "qr"
}
```

### Mark Attendance (Manual)
```json
POST /api/attendance/mark
{
  "student_id": "STU_002",
  "session_id": "SESSION_2025_11_04_001",
  "status": "absent",
  "marked_by": "COACH_001",
  "method": "manual"
}
```

### Get Student Attendance
```
GET /api/attendance/list?student_id=STU_001
```

### Get Session Attendance
```
GET /api/attendance/list?session_id=SESSION_2025_11_04_001
```

## Translations

### Completed Languages
- ✅ English (en.json)
- ✅ Spanish (es.json)

### Pending Translation Keys (Add to remaining locales)
- attendance.myQRCode
- attendance.downloadQR
- attendance.qrScanner
- attendance.startScanning
- attendance.manualEntry
- attendance.present / absent / leave
- attendance.submitAttendance
- attendance.studentDashboard
- attendance.markAttendance
- sidebar.myAttendance
- sidebar.markAttendance

### Remaining Locales to Update
- pt.json (Portuguese)
- pt-BR.json (Brazilian Portuguese)
- de.json (German)
- hi.json (Hindi)
- ta.json (Tamil)
- ml.json (Malayalam)
- zh.json (Chinese)
- ja.json (Japanese)
- ko.json (Korean)

## Database Schema (For Production)

```sql
-- Students table
CREATE TABLE students (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    batch_id VARCHAR,
    batch_name VARCHAR,
    qr_code TEXT,
    enrollment_date DATE,
    phone VARCHAR,
    avatar VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Coaches table
CREATE TABLE coaches (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    assigned_batches TEXT[], -- Array of batch IDs
    phone VARCHAR,
    avatar VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    batch_id VARCHAR,
    batch_name VARCHAR,
    coach_id VARCHAR REFERENCES coaches(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status VARCHAR CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR REFERENCES students(id),
    session_id VARCHAR REFERENCES sessions(id),
    status VARCHAR CHECK (status IN ('present', 'absent', 'leave')),
    date DATE DEFAULT CURRENT_DATE,
    marked_by VARCHAR REFERENCES coaches(id),
    marked_at TIMESTAMP DEFAULT NOW(),
    method VARCHAR CHECK (method IN ('qr', 'manual')),
    UNIQUE(student_id, session_id) -- Prevent duplicates
);

-- Indexes
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_sessions_coach ON sessions(coach_id);
CREATE INDEX idx_sessions_date ON sessions(date);
```

## Next Steps

### Priority
1. ✅ Install missing dependencies: `npm install qrcode react-qr-code html5-qrcode @types/qrcode`
2. ⏳ Complete translations for remaining 9 locales
3. ⏳ Test QR scanning on mobile devices
4. ⏳ Add attendance export (CSV/PDF)
5. ⏳ Connect to real database (replace mock data)

### Future Enhancements
- [ ] Attendance reports with filters (date range, batch, coach)
- [ ] Export functionality (CSV, PDF, Excel)
- [ ] Attendance analytics dashboard
- [ ] Late arrival tracking (timestamp precision)
- [ ] Batch attendance summary view
- [ ] Email notifications for low attendance
- [ ] Attendance history view for coaches
- [ ] Mobile app for easier QR scanning
- [ ] Offline mode support
- [ ] Attendance appeal system

## Troubleshooting

### QR Scanner Not Working
- Ensure HTTPS is enabled (required for camera access)
- Grant camera permissions when prompted
- Check browser compatibility (Chrome/Safari recommended)

### QR Code Not Generating
- Verify student ID exists in database
- Check API endpoint `/api/student/qr` is accessible
- Inspect browser console for errors

### Attendance Not Submitting
- Verify coach is assigned to the batch
- Ensure session exists and is not cancelled
- Check for duplicate attendance entries

## Test Credentials Summary

| Role | Email | Password | ID |
|------|-------|----------|-----|
| Student | student@example.com | student123 | STU_001 |
| Coach | coach@example.com | coach123 | COACH_001 |
| Admin | admin@example.com | admin123 | - |
| User | test@example.com | test123 | - |

## Support & Documentation

- TypeScript interfaces: `types/attendance.ts`
- API utilities: `lib/api/attendance.ts`
- Component documentation: Inline JSDoc comments
- Translation keys: `locales/*.json`

---

**Status**: ✅ Core system complete and functional
**Last Updated**: November 4, 2025
**Version**: 1.0.0
