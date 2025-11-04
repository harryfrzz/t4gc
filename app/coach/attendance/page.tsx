/**
 * Coach Attendance Page
 * Toggle between QR scan and manual attendance modes
 */

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Camera, ClipboardList, Calendar, Users, CheckCircle2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRScanner } from '@/components/attendance/QRScanner';
import { ManualAttendanceForm } from '@/components/attendance/ManualAttendanceForm';
import type { Session } from '@/types/attendance';

export default function CoachAttendancePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'coach') {
      router.push('/auth/login');
      return;
    }

    fetchSessions();
  }, [isAuthenticated, user, router]);

  const fetchSessions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/attendance/sessions?coach_id=${user.id}&date=${today}`);
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.data);
        
        // Auto-select first session
        if (data.data.length > 0) {
          setSelectedSession(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('attendance.markAttendance', 'Mark Attendance')}</h1>
        <p className="text-muted-foreground">
          {t('attendance.coachWelcome', 'Select a session and mark attendance using QR scan or manual entry')}
        </p>
      </div>

      {/* Session Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('attendance.selectSession', 'Select Session')}
          </CardTitle>
          <CardDescription>
            {t('attendance.todaySessions', "Today's training sessions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 bg-muted animate-pulse rounded-md" />
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              <Select
                value={selectedSession?.id}
                onValueChange={handleSessionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('attendance.selectSessionPlaceholder', 'Choose a session')} />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.title}</span>
                        <span className="text-xs text-muted-foreground">
                          ({session.start_time} - {session.end_time})
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {session.batch_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSession && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Batch</div>
                    <div className="text-base font-semibold">{selectedSession.batch_name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Time</div>
                    <div className="text-base font-semibold">
                      {selectedSession.start_time} - {selectedSession.end_time}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                    <div className="text-base font-semibold capitalize flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedSession.status === 'ongoing' ? 'bg-green-600 animate-pulse' :
                        selectedSession.status === 'scheduled' ? 'bg-yellow-600' :
                        selectedSession.status === 'completed' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }`} />
                      {selectedSession.status}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t('attendance.noSessionsToday', 'No sessions scheduled for today')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Marking */}
      {selectedSession && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'qr' | 'manual')}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {t('attendance.qrScan', 'QR Scan')}
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              {t('attendance.manualEntry', 'Manual Entry')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="mt-6">
            <QRScanner
              sessionId={selectedSession.id}
              coachId={user.id || ''}
              onAttendanceMarked={(studentId, studentName) => {
                console.log(`Marked: ${studentName}`);
              }}
            />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <ManualAttendanceForm
              sessionId={selectedSession.id}
              batchId={selectedSession.batch_id}
              coachId={user.id || ''}
              onSubmitSuccess={() => {
                console.log('Attendance submitted successfully');
              }}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Stats */}
      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('attendance.sessionStats', 'Session Statistics')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">-</div>
                <div className="text-xs text-muted-foreground">{t('attendance.totalStudents', 'Total Students')}</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">-</div>
                <div className="text-xs text-muted-foreground">{t('attendance.present', 'Present')}</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600">-</div>
                <div className="text-xs text-muted-foreground">{t('attendance.absent', 'Absent')}</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">-</div>
                <div className="text-xs text-muted-foreground">{t('attendance.leave', 'Leave')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
