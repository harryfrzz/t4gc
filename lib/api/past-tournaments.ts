import { PastTournament, TournamentDetails } from "@/types/past-tournaments";

// Mock data for past tournaments
export const mockPastTournaments: PastTournament[] = [
  {
    id: "pt-1",
    name: "Summer Championship 2023",
    year: 2023,
    startDate: "2023-06-15",
    endDate: "2023-06-20",
    location: "Central Sports Arena",
    winnerTeam: "Blue Strikers",
    runnerUpTeam: "Red Raptors",
    topScorer: {
      name: "Alice Smith",
      goals: 8
    },
    mvp: "Charlie Davis",
    highlightsUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    photoGallery: [],
    status: "completed",
    totalMatches: 15,
    totalTeams: 8,
    description: "Annual summer tournament for all skill levels",
    tournamentType: "Single Elimination",
    bannerImage: "/tournament-banners/summer-2023.jpg"
  },
  {
    id: "pt-2",
    name: "Winter League 2022",
    year: 2022,
    startDate: "2022-12-01",
    endDate: "2022-12-31",
    location: "Indoor Stadium",
    winnerTeam: "Green Warriors",
    runnerUpTeam: "Yellow Dragons",
    topScorer: {
      name: "George Martin",
      goals: 12
    },
    mvp: "Hannah Montana",
    status: "completed",
    totalMatches: 24,
    totalTeams: 8,
    description: "Round-robin winter league tournament",
    tournamentType: "Round Robin",
  },
  {
    id: "pt-3",
    name: "Spring Invitational 2023",
    year: 2023,
    startDate: "2023-03-10",
    endDate: "2023-03-15",
    location: "University Sports Complex",
    winnerTeam: "Purple Knights",
    runnerUpTeam: "Orange Tigers",
    topScorer: {
      name: "Samuel Jackson",
      goals: 6
    },
    mvp: "Rachel Green",
    status: "completed",
    totalMatches: 12,
    totalTeams: 6,
    description: "Exclusive invitational tournament",
    tournamentType: "Double Elimination",
  },
];

export const mockTournamentDetails: Record<string, TournamentDetails> = {
  "pt-1": {
    ...mockPastTournaments[0],
    standings: [
      {
        position: 1,
        teamName: "Blue Strikers",
        played: 5,
        won: 5,
        drawn: 0,
        lost: 0,
        goalsFor: 15,
        goalsAgainst: 3,
        goalDifference: 12,
        points: 15
      },
      {
        position: 2,
        teamName: "Red Raptors",
        played: 5,
        won: 4,
        drawn: 0,
        lost: 1,
        goalsFor: 12,
        goalsAgainst: 6,
        goalDifference: 6,
        points: 12
      },
      {
        position: 3,
        teamName: "Green Warriors",
        played: 4,
        won: 3,
        drawn: 0,
        lost: 1,
        goalsFor: 10,
        goalsAgainst: 5,
        goalDifference: 5,
        points: 9
      },
      {
        position: 4,
        teamName: "Yellow Dragons",
        played: 4,
        won: 2,
        drawn: 1,
        lost: 1,
        goalsFor: 8,
        goalsAgainst: 7,
        goalDifference: 1,
        points: 7
      },
    ],
    keyMatches: [
      {
        id: "m1",
        homeTeam: "Blue Strikers",
        awayTeam: "Red Raptors",
        homeScore: 3,
        awayScore: 1,
        date: "2023-06-20",
        stage: "Final",
        venue: "Central Sports Arena"
      },
      {
        id: "m2",
        homeTeam: "Blue Strikers",
        awayTeam: "Green Warriors",
        homeScore: 2,
        awayScore: 1,
        date: "2023-06-19",
        stage: "Semi-Final",
        venue: "Central Sports Arena"
      },
      {
        id: "m3",
        homeTeam: "Red Raptors",
        awayTeam: "Yellow Dragons",
        homeScore: 4,
        awayScore: 2,
        date: "2023-06-19",
        stage: "Semi-Final",
        venue: "Central Sports Arena"
      },
    ],
    playerAwards: [
      {
        category: "Most Valuable Player",
        playerName: "Charlie Davis",
        teamName: "Blue Strikers",
        stats: "5 goals, 3 assists"
      },
      {
        category: "Golden Boot",
        playerName: "Alice Smith",
        teamName: "Blue Strikers",
        stats: "8 goals"
      },
      {
        category: "Best Goalkeeper",
        playerName: "Diana Ross",
        teamName: "Blue Strikers",
        stats: "3 clean sheets"
      },
    ],
    finalMatchResult: {
      id: "m1",
      homeTeam: "Blue Strikers",
      awayTeam: "Red Raptors",
      homeScore: 3,
      awayScore: 1,
      date: "2023-06-20",
      stage: "Final",
      venue: "Central Sports Arena"
    }
  },
  "pt-2": {
    ...mockPastTournaments[1],
    standings: [
      {
        position: 1,
        teamName: "Green Warriors",
        played: 14,
        won: 10,
        drawn: 3,
        lost: 1,
        goalsFor: 32,
        goalsAgainst: 12,
        goalDifference: 20,
        points: 33
      },
      {
        position: 2,
        teamName: "Yellow Dragons",
        played: 14,
        won: 9,
        drawn: 4,
        lost: 1,
        goalsFor: 28,
        goalsAgainst: 10,
        goalDifference: 18,
        points: 31
      },
      {
        position: 3,
        teamName: "Blue Strikers",
        played: 14,
        won: 8,
        drawn: 2,
        lost: 4,
        goalsFor: 25,
        goalsAgainst: 18,
        goalDifference: 7,
        points: 26
      },
    ],
    keyMatches: [
      {
        id: "wm1",
        homeTeam: "Green Warriors",
        awayTeam: "Yellow Dragons",
        homeScore: 2,
        awayScore: 1,
        date: "2022-12-28",
        stage: "Championship Decider",
        venue: "Indoor Stadium"
      },
    ],
    playerAwards: [
      {
        category: "Most Valuable Player",
        playerName: "Hannah Montana",
        teamName: "Green Warriors",
        stats: "10 goals, 8 assists"
      },
      {
        category: "Golden Boot",
        playerName: "George Martin",
        teamName: "Green Warriors",
        stats: "12 goals"
      },
    ],
  },
  "pt-3": {
    ...mockPastTournaments[2],
    standings: [
      {
        position: 1,
        teamName: "Purple Knights",
        played: 4,
        won: 4,
        drawn: 0,
        lost: 0,
        goalsFor: 12,
        goalsAgainst: 4,
        goalDifference: 8,
        points: 12
      },
      {
        position: 2,
        teamName: "Orange Tigers",
        played: 4,
        won: 3,
        drawn: 0,
        lost: 1,
        goalsFor: 10,
        goalsAgainst: 5,
        goalDifference: 5,
        points: 9
      },
    ],
    keyMatches: [
      {
        id: "sm1",
        homeTeam: "Purple Knights",
        awayTeam: "Orange Tigers",
        homeScore: 3,
        awayScore: 2,
        date: "2023-03-15",
        stage: "Final",
        venue: "University Sports Complex"
      },
    ],
    playerAwards: [
      {
        category: "Most Valuable Player",
        playerName: "Rachel Green",
        teamName: "Purple Knights",
        stats: "4 goals, 5 assists"
      },
      {
        category: "Golden Boot",
        playerName: "Samuel Jackson",
        teamName: "Orange Tigers",
        stats: "6 goals"
      },
    ],
    finalMatchResult: {
      id: "sm1",
      homeTeam: "Purple Knights",
      awayTeam: "Orange Tigers",
      homeScore: 3,
      awayScore: 2,
      date: "2023-03-15",
      stage: "Final",
      venue: "University Sports Complex"
    }
  }
};

export async function getPastTournaments(): Promise<PastTournament[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPastTournaments;
}

export async function getTournamentDetails(id: string): Promise<TournamentDetails | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTournamentDetails[id] || null;
}
