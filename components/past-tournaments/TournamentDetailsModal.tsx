"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Target, Calendar, MapPin, Medal, Play } from "lucide-react";
import { TournamentDetails } from "@/types/past-tournaments";

interface TournamentDetailsModalProps {
  tournament: TournamentDetails | null;
  open: boolean;
  onClose: () => void;
}

export function TournamentDetailsModal({ tournament, open, onClose }: TournamentDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {tournament && (
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl">{tournament.name}</DialogTitle>
                <DialogDescription className="mt-2 flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                  {tournament.location}
                </span>
              </DialogDescription>
            </div>
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {tournament.year}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Winner Highlight */}
          <Card className="border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-neutral-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 dark:bg-amber-600 rounded-full">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Tournament Champion</div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {tournament.winnerTeam}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      Runner-up: {tournament.runnerUpTeam}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tournament Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-2xl font-bold">{tournament.totalMatches}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Total Matches</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Medal className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                <div>
                  <div className="text-2xl font-bold">{tournament.totalTeams}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Teams Participated</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Trophy className="h-8 w-8 text-green-500 dark:text-green-400" />
                <div>
                  <div className="text-lg font-bold line-clamp-1">{tournament.tournamentType}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Format</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Match */}
          {tournament.finalMatchResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Final Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-6 py-4">
                  <div className="text-center flex-1">
                    <div className="text-xl font-bold">{tournament.finalMatchResult.homeTeam}</div>
                  </div>
                  <div className="text-center px-6 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <div className="text-3xl font-bold">
                      {tournament.finalMatchResult.homeScore} - {tournament.finalMatchResult.awayScore}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Final Score</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-xl font-bold">{tournament.finalMatchResult.awayTeam}</div>
                  </div>
                </div>
                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  {new Date(tournament.finalMatchResult.date).toLocaleDateString()} • {tournament.finalMatchResult.venue}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Awards */}
          {tournament.playerAwards && tournament.playerAwards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Player Awards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournament.playerAwards.map((award, index) => (
                    <div key={index} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        {award.category}
                      </div>
                      <div className="font-bold text-lg">{award.playerName}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{award.teamName}</div>
                      {award.stats && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{award.stats}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Standings */}
          {tournament.standings && tournament.standings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Final Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b dark:border-neutral-800">
                      <tr className="text-left">
                        <th className="pb-2 font-semibold">#</th>
                        <th className="pb-2 font-semibold">Team</th>
                        <th className="pb-2 font-semibold text-center">P</th>
                        <th className="pb-2 font-semibold text-center">W</th>
                        <th className="pb-2 font-semibold text-center">D</th>
                        <th className="pb-2 font-semibold text-center">L</th>
                        <th className="pb-2 font-semibold text-center">GF</th>
                        <th className="pb-2 font-semibold text-center">GA</th>
                        <th className="pb-2 font-semibold text-center">GD</th>
                        <th className="pb-2 font-semibold text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.standings.map((team, index) => (
                        <tr key={index} className="border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                          <td className="py-2">{team.position}</td>
                          <td className="py-2 font-medium">{team.teamName}</td>
                          <td className="py-2 text-center">{team.played}</td>
                          <td className="py-2 text-center">{team.won}</td>
                          <td className="py-2 text-center">{team.drawn}</td>
                          <td className="py-2 text-center">{team.lost}</td>
                          <td className="py-2 text-center">{team.goalsFor}</td>
                          <td className="py-2 text-center">{team.goalsAgainst}</td>
                          <td className="py-2 text-center">{team.goalDifference}</td>
                          <td className="py-2 text-center font-bold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Matches */}
          {tournament.keyMatches && tournament.keyMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tournament.keyMatches.map((match) => (
                    <div key={match.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">{match.stage}</Badge>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 text-right font-medium">{match.homeTeam}</div>
                        <div className="px-4 py-2 bg-white dark:bg-neutral-900 rounded font-bold">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="flex-1 font-medium">{match.awayTeam}</div>
                      </div>
                      <div className="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-2">
                        {match.venue}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Highlights */}
          {tournament.highlightsUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Tournament Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={tournament.highlightsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-full">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Watch Highlights</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">Click to view on YouTube</div>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
      )}
    </Dialog>
  );
}
