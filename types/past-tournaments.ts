export interface PastTournament {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  location: string;
  winnerTeam: string;
  runnerUpTeam: string;
  topScorer: {
    name: string;
    goals: number;
  };
  mvp: string;
  highlightsUrl?: string;
  photoGallery?: string[];
  status: 'completed';
  totalMatches: number;
  totalTeams: number;
  description?: string;
  tournamentType: string;
  bannerImage?: string;
}

export interface TeamStanding {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface MatchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  stage: string;
  venue: string;
}

export interface PlayerAward {
  category: string;
  playerName: string;
  teamName: string;
  stats?: string;
}

export interface TournamentDetails extends PastTournament {
  standings: TeamStanding[];
  keyMatches: MatchResult[];
  playerAwards: PlayerAward[];
  finalMatchResult?: MatchResult;
}
