'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTournament } from '@/lib/api/tournaments';
import { Tournament } from '@/types/tournaments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, User } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState(user?.role === 'student' ? 'myteam' : 'participants');
  const [participants, setParticipants] = useState<any[]>([]);
  
  const isAdmin = user?.role === "admin" || user?.role === "teacher";

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

  // Check if user is admin (view-only for tournaments)
  const isAdminViewOnly = user?.role === "admin";
  const isEventHoster = user?.role === "teacher";

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
            <Button onClick={() => router.push('/tournaments')}>Back to Tournaments</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/tournaments')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tournaments
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
          {isEventHoster && (
            <>
              <Button onClick={() => router.push(`/tournaments/${tournament.id}/create-form`)} variant="outline">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Form
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
            </>
          )}
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
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <TabsTrigger value="participants">Participants</TabsTrigger>
          )}
          {user?.role === 'student' && (
            <TabsTrigger value="myteam">My Team</TabsTrigger>
          )}
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
        </TabsList>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <TabsContent value="participants">
            {isAdminViewOnly ? (
              <Card>
                <CardHeader>
                  <CardTitle>Participants (View Only)</CardTitle>
                  <CardDescription>
                    As an admin, you can view participants but cannot make changes. Contact a teacher to manage participants.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ParticipantsModule onParticipantsChange={setParticipants} viewOnly={true} />
                </CardContent>
              </Card>
            ) : (
              <ParticipantsModule onParticipantsChange={setParticipants} />
            )}
          </TabsContent>
        )}

        {user?.role === 'student' && (
          <TabsContent value="myteam">
            <Card>
              <CardHeader>
                <CardTitle>My Team</CardTitle>
                <CardDescription>
                  View your team members and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Find student's team
                  const studentParticipant = participants.find(p => p.contact === user?.email);
                  const studentTeam = studentParticipant?.team;
                  
                  if (!studentTeam) {
                    return (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Not Part of a Team</h3>
                        <p className="text-sm text-muted-foreground">
                          You haven't been assigned to a team yet.
                        </p>
                      </div>
                    );
                  }

                  const teamMembers = participants.filter(p => p.team === studentTeam && p.status === 'Approved');

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          <div>
                            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-300">{studentTeam}</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                              {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teamMembers.map((member) => (
                          <Card key={member.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm truncate">{member.name}</h4>
                                    {member.contact === user?.email && (
                                      <Badge variant="secondary" className="text-xs">You</Badge>
                                    )}
                                  </div>
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <p className="flex items-center gap-1">
                                      <Badge variant="outline" className="text-xs">
                                        {member.role}
                                      </Badge>
                                    </p>
                                    <p>Age: {member.age}</p>
                                    <p>Gender: {member.gender}</p>
                                    <p className="truncate">{member.contact}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border dark:border-neutral-800">
                        <h4 className="font-semibold text-sm mb-3">Team Statistics</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {teamMembers.filter(m => m.role === 'Player').length}
                            </p>
                            <p className="text-xs text-muted-foreground">Players</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {teamMembers.filter(m => m.role === 'Coach').length}
                            </p>
                            <p className="text-xs text-muted-foreground">Coaches</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {teamMembers.filter(m => m.role === 'Volunteer').length}
                            </p>
                            <p className="text-xs text-muted-foreground">Volunteers</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
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
