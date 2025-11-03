'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTournament } from '@/lib/api/tournaments';
import { Tournament } from '@/types/tournaments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, BarChart3 } from 'lucide-react';
import ParticipantsModule from '@/components/participants/ParticipantsModule';
import TimelineView from '@/components/participants/TimelineView';
import FixtureGenerator from '@/components/participants/FixtureGenerator';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'UPCOMING': return 'bg-blue-100 text-blue-800';
    case 'ONGOING': return 'bg-green-100 text-green-800';
    case 'COMPLETED': return 'bg-gray-100 text-gray-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'SINGLE_ELIMINATION': return 'Single Elimination';
    case 'DOUBLE_ELIMINATION': return 'Double Elimination';
    case 'ROUND_ROBIN': return 'Round Robin';
    case 'SWISS': return 'Swiss';
    case 'LEAGUE': return 'League';
    default: return type;
  }
};

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tournamentId = parseInt(params.id as string);
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');
  const [participants, setParticipants] = useState<any[]>([]);
  
  const isEventHoster = user?.role === "event-hoster";

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
      alert('Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tournament...</p>
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

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight">{tournament.name}</h1>
            <p className="text-muted-foreground mt-2">{tournament.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(tournament.status)} variant="secondary">
              {tournament.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => router.push(`/tournaments/${tournament.id}/create-form`)} variant="outline">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create Form
          </Button>
          <Button onClick={() => router.push(`/tournaments/${tournament.id}/analytics`)} variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Match Analytics
          </Button>
          <Button onClick={() => {
            const link = `${window.location.origin}/tournaments/${tournament.id}/register`;
            navigator.clipboard.writeText(link);
            toast.success("Registration link copied!");
          }} variant="outline">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Link
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-semibold text-sm truncate">{getTypeLabel(tournament.type)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold text-xs leading-relaxed">
                  {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(tournament.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-sm truncate">{tournament.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Participants</p>
                <p className="font-semibold text-sm">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="participants">
          <ParticipantsModule onParticipantsChange={setParticipants} />
        </TabsContent>
        
        <TabsContent value="timeline">
          <TimelineView tournament={tournament} />
        </TabsContent>
        
        <TabsContent value="fixtures">
          <FixtureGenerator participants={participants} isEventHoster={isEventHoster} />
        </TabsContent>
      </Tabs>
    </div>
  );
}