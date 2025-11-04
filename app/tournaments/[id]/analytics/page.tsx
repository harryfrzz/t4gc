'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTournament } from '@/lib/api/tournaments';
import { Tournament } from '@/types/tournaments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Users, TrendingUp, Activity, Target, PieChart as PieChartIcon } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for analytics
const mockMatchData = [
  { match: 'Match 1', team1Score: 3, team2Score: 1, attendance: 450 },
  { match: 'Match 2', team1Score: 2, team2Score: 2, attendance: 380 },
  { match: 'Match 3', team1Score: 4, team2Score: 0, attendance: 520 },
  { match: 'Match 4', team1Score: 1, team2Score: 3, attendance: 410 },
  { match: 'Match 5', team1Score: 2, team2Score: 1, attendance: 490 },
];

const mockPerformanceData = [
  { week: 'Week 1', wins: 12, losses: 8, draws: 3 },
  { week: 'Week 2', wins: 15, losses: 6, draws: 4 },
  { week: 'Week 3', wins: 18, losses: 5, draws: 2 },
  { week: 'Week 4', wins: 20, losses: 3, draws: 2 },
];

const mockGenderData = [
  { name: 'Male', value: 65, color: '#3b82f6' },
  { name: 'Female', value: 35, color: '#ec4899' },
];

const mockMatchReports = [
  {
    id: 1,
    matchName: 'Semi-Final 1',
    date: '2024-11-15',
    team1: 'Eagles FC',
    team2: 'Hawks United',
    score: '3-2',
    highlights: 'Intense match with last-minute goal',
    attendance: 450,
    mvp: 'John Doe',
  },
  {
    id: 2,
    matchName: 'Semi-Final 2',
    date: '2024-11-16',
    team1: 'Tigers SC',
    team2: 'Lions FC',
    score: '2-2 (4-3 on penalties)',
    highlights: 'Dramatic penalty shootout',
    attendance: 520,
    mvp: 'Jane Smith',
  },
  {
    id: 3,
    matchName: 'Final',
    date: '2024-11-20',
    team1: 'Eagles FC',
    team2: 'Lions FC',
    score: '4-1',
    highlights: 'Dominant performance by Eagles FC',
    attendance: 680,
    mvp: 'Mike Johnson',
  },
];

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

export default function TournamentAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = parseInt(params.id as string);
  const analyticsRef = useRef<HTMLDivElement>(null);
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadTournamentData();
  }, [tournamentId]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      const tournamentRes = await getTournament(tournamentId);
      setTournament(tournamentRes.data);
    } catch (error) {
      console.error('Error loading tournament:', error);
      toast.error('Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPNG = async () => {
    if (!analyticsRef.current) return;
    
    setExporting(true);
    toast.info('Generating PNG...');
    
    try {
      const canvas = await html2canvas(analyticsRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `tournament-${tournamentId}-analytics.png`;
      link.href = image;
      link.click();
      
      toast.success('Analytics exported successfully!');
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Failed to export analytics');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Tournament Not Found</CardTitle>
            <CardDescription>The tournament you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalMale = Math.round((mockGenderData[0].value / 100) * (tournament.currentParticipants || 0));
  const totalFemale = Math.round((mockGenderData[1].value / 100) * (tournament.currentParticipants || 0));

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push(`/tournaments/${tournamentId}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tournament
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight">Match Analytics</h1>
            <p className="text-muted-foreground mt-2">{tournament.name}</p>
          </div>
          <Button onClick={handleExportPNG} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export as PNG'}
          </Button>
        </div>
      </div>

      <div ref={analyticsRef} className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total Matches</p>
                  <p className="text-2xl font-bold">{mockMatchReports.length}</p>
                  <p className="text-xs text-green-600 mt-1">+2 from last week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total Participants</p>
                  <p className="text-2xl font-bold">{tournament.currentParticipants}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {tournament.maxParticipants} max
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Avg Attendance</p>
                  <p className="text-2xl font-bold">492</p>
                  <p className="text-xs text-green-600 mt-1">+12% increase</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Goals Scored</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground mt-1">2.1 per match</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gender Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Gender Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of registered participants by gender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockGenderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockGenderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Male Participants</p>
                  <p className="text-2xl font-bold text-blue-600">{totalMale}</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Female Participants</p>
                  <p className="text-2xl font-bold text-pink-600">{totalFemale}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Match Attendance Trends</CardTitle>
              <CardDescription>
                Attendance numbers across different matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMatchData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#3b82f6" name="Attendance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>
              Win/Loss/Draw statistics throughout the tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="wins" stroke="#10b981" strokeWidth={2} name="Wins" />
                  <Line type="monotone" dataKey="losses" stroke="#ef4444" strokeWidth={2} name="Losses" />
                  <Line type="monotone" dataKey="draws" stroke="#f59e0b" strokeWidth={2} name="Draws" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Match Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Match Reports</CardTitle>
            <CardDescription>
              Detailed reports from recent matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMatchReports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{report.matchName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{report.date}</p>
                        <Badge variant="outline" className="mb-2">
                          {report.team1} vs {report.team2}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Final Score</p>
                        <p className="text-2xl font-bold mb-3">{report.score}</p>
                        <p className="text-sm">
                          <span className="font-medium">MVP:</span> {report.mvp}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Attendance</p>
                        <p className="text-xl font-semibold mb-3">{report.attendance}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.highlights}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>
              Comparison of team scores across matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMatchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="team1Score" fill="#3b82f6" name="Team 1 Score" />
                  <Bar dataKey="team2Score" fill="#ec4899" name="Team 2 Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}