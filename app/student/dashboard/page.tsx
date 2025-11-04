/**
 * Student Dashboard Page
 * Displays QR code, attendance summary, and attendance trends
 */

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeDisplay } from '@/components/attendance/QRCodeDisplay';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AttendanceSummary, AttendanceTrend } from '@/types/attendance';

export default function StudentDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [trend, setTrend] = useState<AttendanceTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/auth/login');
      return;
    }

    fetchAttendanceData();
  }, [isAuthenticated, user, router]);

  const fetchAttendanceData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch attendance records
      const response = await fetch(`/api/attendance/list?student_id=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const records = data.data;

        // Calculate summary
        const total = records.length;
        const present = records.filter((r: any) => r.status === 'present').length;
        const absent = records.filter((r: any) => r.status === 'absent').length;
        const leave = records.filter((r: any) => r.status === 'leave').length;

        setSummary({
          student_id: user.id,
          total_sessions: total,
          attended: present,
          absent,
          leave,
          attendance_percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        });

        // Prepare trend data
        const trendData = records
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-30)
          .map((r: any) => ({
            date: r.date,
            status: r.status,
          }));
        
        setTrend(trendData);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const getChartData = () => {
    return trend.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      attendance: item.status === 'present' ? 1 : 0,
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('attendance.studentDashboard', 'Student Dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('attendance.welcomeMessage', 'Welcome back')}, {user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Display */}
        <div className="lg:col-span-1">
          <QRCodeDisplay studentId={user.id || ''} studentName={user.name} />
        </div>

        {/* Attendance Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-20 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted animate-pulse rounded w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Sessions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('attendance.totalSessions', 'Total Sessions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.total_sessions}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('attendance.sessionsAttended', 'Sessions attended')}
                  </p>
                </CardContent>
              </Card>

              {/* Attendance Percentage */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t('attendance.attendanceRate', 'Attendance Rate')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {summary.attendance_percentage}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.attended} / {summary.total_sessions} {t('attendance.present', 'present')}
                  </p>
                </CardContent>
              </Card>

              {/* Performance Badge */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {t('attendance.performance', 'Performance')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.attendance_percentage >= 90 ? '⭐ Excellent' : 
                     summary.attendance_percentage >= 75 ? '✓ Good' : 
                     summary.attendance_percentage >= 60 ? '⚠ Average' : '❌ Poor'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.absent} {t('attendance.absent', 'absent')}, {summary.leave} {t('attendance.leave', 'leave')}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Attendance Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('attendance.attendanceTrend', 'Attendance Trend')}</CardTitle>
              <CardDescription>
                {t('attendance.trendDescription', 'Your attendance pattern over the last 30 sessions')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    {t('common.loading', 'Loading...')}
                  </div>
                </div>
              ) : trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                      ticks={[0, 1]}
                      domain={[0, 1]}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.date}</p>
                              <p className="text-xs text-muted-foreground">
                                {payload[0].value === 1 ? '✓ Present' : '✗ Absent/Leave'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="stepAfter" 
                      dataKey="attendance" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  {t('attendance.noData', 'No attendance data available')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
