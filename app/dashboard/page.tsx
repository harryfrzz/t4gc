"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getAllTournaments } from "@/lib/api/tournaments";
import { Tournament } from "@/types/tournaments";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "react-i18next";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'UPCOMING': return 'bg-blue-100 text-blue-800';
    case 'ONGOING': return 'bg-green-100 text-green-800';
    case 'COMPLETED': return 'bg-gray-100 text-gray-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isEventHoster = user?.role === "event-hoster";

  // Translation helper for tournament types
  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'SINGLE_ELIMINATION': t('dashboard.type.singleElimination'),
      'DOUBLE_ELIMINATION': t('dashboard.type.doubleElimination'),
      'ROUND_ROBIN': t('dashboard.type.roundRobin'),
      'SWISS': t('dashboard.type.swiss'),
      'LEAGUE': t('dashboard.type.league'),
    };
    return typeMap[type] || type;
  };

  // Translation helper for status
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'UPCOMING': t('dashboard.status.upcoming'),
      'ONGOING': t('dashboard.status.ongoing'),
      'COMPLETED': t('dashboard.status.completed'),
      'CANCELLED': t('dashboard.status.cancelled'),
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await getAllTournaments();
      
      if (isEventHoster) {
        setTournaments(response.data);
      } else {
        const registeredTournaments = response.data.filter(t => 
          t.status === 'UPCOMING' || t.status === 'ONGOING'
        );
        setTournaments(registeredTournaments);
      }
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-neutral-600 mt-1">{t('dashboard.loading')}</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-neutral-600 mt-1">
          {tournaments.length > 0 
            ? t('dashboard.tournamentsAvailable', { count: tournaments.length })
            : t('dashboard.noTournaments')}
        </p>
      </div>
      
      {tournaments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-16 w-16 text-neutral-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('dashboard.noTournamentsTitle')}</h3>
            <p className="text-neutral-600 mb-6">{t('dashboard.noTournamentsDesc')}</p>
            <Link 
              href="/tournaments/create"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t('dashboard.createTournament')}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className="block group">
              <motion.div 
                whileHover={{ y: -2, scale: 1.02 }} 
                whileTap={{ scale: 0.99 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="rounded-2xl h-full border-neutral-200/70 overflow-hidden transition-all duration-200 group-hover:shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-white to-neutral-50 group-hover:from-neutral-50 group-hover:to-white">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-1">{tournament.name}</CardTitle>
                      <Badge className={getStatusColor(tournament.status)} variant="secondary">
                        {getStatusLabel(tournament.status)}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {tournament.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center text-sm text-neutral-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      {getTypeLabel(tournament.type)}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {tournament.location}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <Users className="h-4 w-4 mr-2" />
                      {tournament.currentParticipants}/{tournament.maxParticipants} {t('dashboard.participants')}
                    </div>
                    <div className="pt-2 flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                      {t('dashboard.viewDetails')}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}