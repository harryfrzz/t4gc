/**
 * Manual Attendance Form Component
 * Roster-based attendance marking for fallback entry
 */

"use client";

import { useState, useEffect } from 'react';
import { ClipboardList, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Student, AttendanceStatus } from '@/types/attendance';

interface ManualAttendanceFormProps {
  sessionId: string;
  batchId: string;
  coachId: string;
  onSubmitSuccess?: () => void;
}

export function ManualAttendanceForm({ 
  sessionId, 
  batchId, 
  coachId,
  onSubmitSuccess 
}: ManualAttendanceFormProps) {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [batchId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance/students?batch_id=${batchId}`);
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data);
        
        // Initialize all as present by default
        const initialData: Record<string, AttendanceStatus> = {};
        data.data.forEach((student: Student) => {
          initialData[student.id] = 'present';
        });
        setAttendanceData(initialData);
      } else {
        toast.error('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Submit attendance for each student
      const promises = students.map(async (student) => {
        const status = attendanceData[student.id];
        
        const response = await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: student.id,
            session_id: sessionId,
            status,
            marked_by: coachId,
            method: 'manual',
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to mark attendance for ${student.name}`);
        }
        
        return response.json();
      });

      await Promise.all(promises);
      
      toast.success('Attendance submitted successfully for all students');
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      present: 0,
      absent: 0,
      leave: 0,
    };

    Object.values(attendanceData).forEach((status) => {
      counts[status]++;
    });

    return counts;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {t('attendance.manualEntry', 'Manual Attendance Entry')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          {t('attendance.manualEntry', 'Manual Attendance Entry')}
        </CardTitle>
        <CardDescription>
          {t('attendance.manualDescription', 'Mark attendance for each student individually')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.present}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.present', 'Present')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.absent}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.absent', 'Absent')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.leave}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.leave', 'Leave')}</div>
          </div>
        </div>

        {/* Student Roster */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{student.name}</div>
                  <div className="text-xs text-muted-foreground">{student.id}</div>
                </div>
              </div>
              <Select
                value={attendanceData[student.id]}
                onValueChange={(value) => handleStatusChange(student.id, value as AttendanceStatus)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      {t('attendance.present', 'Present')}
                    </span>
                  </SelectItem>
                  <SelectItem value="absent">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      {t('attendance.absent', 'Absent')}
                    </span>
                  </SelectItem>
                  <SelectItem value="leave">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-600" />
                      {t('attendance.leave', 'Leave')}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className="w-full"
          size="lg"
        >
          {submitting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('attendance.submitting', 'Submitting...')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('attendance.submitAttendance', 'Submit Attendance')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
