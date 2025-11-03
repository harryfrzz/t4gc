"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TournamentCard } from "@/components/past-tournaments/TournamentCard";
import { TournamentDetailsModal } from "@/components/past-tournaments/TournamentDetailsModal";
import { PastTournament, TournamentDetails } from "@/types/past-tournaments";

export default function PastTournamentsPage() {
  const [tournaments, setTournaments] = useState<PastTournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<PastTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTournament, setSelectedTournament] = useState<TournamentDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    filterTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedYear, tournaments]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tournaments/past");
      const data = await response.json();
      
      if (data.success) {
        setTournaments(data.data);
        setFilteredTournaments(data.data);
      }
    } catch (error) {
      console.error("Error loading tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTournaments = () => {
    let filtered = [...tournaments];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.winnerTeam.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter((t) => t.year.toString() === selectedYear);
    }

    setFilteredTournaments(filtered);
  };

  const handleTournamentClick = async (tournamentId: string) => {
    try {
      setLoadingDetails(true);
      console.log("Fetching tournament details for:", tournamentId);
      const response = await fetch(`/api/tournaments/${tournamentId}`);
      const data = await response.json();
      
      console.log("Tournament details response:", data);
      
      if (data.success) {
        setSelectedTournament(data.data);
        setModalOpen(true);
      } else {
        console.error("Failed to load tournament:", data.error);
      }
    } catch (error) {
      console.error("Error loading tournament details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTournament(null), 300);
  };

  // Get unique years for filter
  const availableYears = Array.from(new Set(tournaments.map((t) => t.year))).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Past Tournaments</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Loading tournament history...</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-7 w-7 text-amber-500 dark:text-amber-400" />
          Past Tournaments
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {tournaments.length > 0
            ? `Browse ${tournaments.length} completed tournament${tournaments.length > 1 ? "s" : ""}`
            : "No past tournaments available yet"}
        </p>
      </div>

      {tournaments.length > 0 && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search tournaments, locations, or winners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Year Filter */}
                <div className="md:w-48">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent dark:bg-neutral-800 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              {(searchQuery || selectedYear !== "all") && (
                <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                  Showing {filteredTournaments.length} of {tournaments.length} tournaments
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tournament Grid */}
          {filteredTournaments.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTournaments.map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TournamentCard
                    tournament={tournament}
                    onClick={() => handleTournamentClick(tournament.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Filter className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedYear("all");
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Clear filters
                </button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {tournaments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Past Tournaments Yet</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md">
              Once tournaments are completed, they will appear here with full details, standings, and highlights.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Details Modal */}
      <TournamentDetailsModal
        tournament={selectedTournament}
        open={modalOpen}
        onClose={handleCloseModal}
      />

      {/* Loading Overlay */}
      {loadingDetails && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">Loading details...</p>
          </div>
        </div>
      )}
    </div>
  );
}
