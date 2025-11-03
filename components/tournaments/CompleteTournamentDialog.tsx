"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Award, Target } from "lucide-react";
import { toast } from "sonner";

interface CompleteTournamentDialogProps {
  tournamentId: string;
  tournamentName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompleteTournamentDialog({
  tournamentId,
  tournamentName,
  open,
  onClose,
  onSuccess
}: CompleteTournamentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    winnerTeam: "",
    runnerUpTeam: "",
    topScorer: "",
    topScorerGoals: "",
    mvp: "",
    totalMatches: "",
    highlightsUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.winnerTeam.trim()) newErrors.winnerTeam = true;
    if (!formData.runnerUpTeam.trim()) newErrors.runnerUpTeam = true;
    if (!formData.topScorer.trim()) newErrors.topScorer = true;
    if (!formData.topScorerGoals || parseInt(formData.topScorerGoals) < 0) newErrors.topScorerGoals = true;
    if (!formData.mvp.trim()) newErrors.mvp = true;
    if (!formData.totalMatches || parseInt(formData.totalMatches) < 1) newErrors.totalMatches = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/tournaments/${tournamentId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winnerTeam: formData.winnerTeam,
          runnerUpTeam: formData.runnerUpTeam,
          topScorer: {
            name: formData.topScorer,
            goals: parseInt(formData.topScorerGoals)
          },
          mvp: formData.mvp,
          totalMatches: parseInt(formData.totalMatches),
          highlightsUrl: formData.highlightsUrl || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Tournament marked as completed!", {
          description: `${formData.winnerTeam} crowned as champions!`
        });
        onSuccess();
        handleClose();
      } else {
        toast.error("Failed to complete tournament", {
          description: data.error || "Please try again"
        });
      }
    } catch (error) {
      console.error("Error completing tournament:", error);
      toast.error("An error occurred", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        winnerTeam: "",
        runnerUpTeam: "",
        topScorer: "",
        topScorerGoals: "",
        mvp: "",
        totalMatches: "",
        highlightsUrl: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-6 w-6 text-amber-500" />
            Complete Tournament
          </DialogTitle>
          <DialogDescription>
            Mark "{tournamentName}" as completed and record the final results.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Winner and Runner-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="winnerTeam" className="flex items-center gap-1.5 dark:text-neutral-200">
                <Trophy className="h-4 w-4 text-amber-500" />
                Winner Team <span className="text-red-500">*</span>
              </Label>
              <Input
                id="winnerTeam"
                value={formData.winnerTeam}
                onChange={(e) => handleChange("winnerTeam", e.target.value)}
                placeholder="Enter winning team name"
                className={errors.winnerTeam ? "border-red-500" : ""}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="runnerUpTeam" className="dark:text-neutral-200">
                Runner-up Team <span className="text-red-500">*</span>
              </Label>
              <Input
                id="runnerUpTeam"
                value={formData.runnerUpTeam}
                onChange={(e) => handleChange("runnerUpTeam", e.target.value)}
                placeholder="Enter runner-up team name"
                className={errors.runnerUpTeam ? "border-red-500" : ""}
                disabled={loading}
              />
            </div>
          </div>

          {/* Top Scorer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topScorer" className="flex items-center gap-1.5 dark:text-neutral-200">
                <Target className="h-4 w-4 text-blue-500" />
                Top Scorer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topScorer"
                value={formData.topScorer}
                onChange={(e) => handleChange("topScorer", e.target.value)}
                placeholder="Player name"
                className={errors.topScorer ? "border-red-500" : ""}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="topScorerGoals" className="dark:text-neutral-200">
                Goals Scored <span className="text-red-500">*</span>
              </Label>
              <Input
                id="topScorerGoals"
                type="number"
                min="0"
                value={formData.topScorerGoals}
                onChange={(e) => handleChange("topScorerGoals", e.target.value)}
                placeholder="Number of goals"
                className={errors.topScorerGoals ? "border-red-500" : ""}
                disabled={loading}
              />
            </div>
          </div>

          {/* MVP */}
          <div>
            <Label htmlFor="mvp" className="flex items-center gap-1.5 dark:text-neutral-200">
              <Award className="h-4 w-4 text-purple-500" />
              Most Valuable Player (MVP) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mvp"
              value={formData.mvp}
              onChange={(e) => handleChange("mvp", e.target.value)}
              placeholder="Enter MVP name"
              className={errors.mvp ? "border-red-500" : ""}
              disabled={loading}
            />
          </div>

          {/* Total Matches */}
          <div>
            <Label htmlFor="totalMatches" className="dark:text-neutral-200">
              Total Matches Played <span className="text-red-500">*</span>
            </Label>
            <Input
              id="totalMatches"
              type="number"
              min="1"
              value={formData.totalMatches}
              onChange={(e) => handleChange("totalMatches", e.target.value)}
              placeholder="Number of matches"
              className={errors.totalMatches ? "border-red-500" : ""}
              disabled={loading}
            />
          </div>

          {/* Highlights URL (Optional) */}
          <div>
            <Label htmlFor="highlightsUrl" className="dark:text-neutral-200">
              Highlights Video URL (Optional)
            </Label>
            <Input
              id="highlightsUrl"
              type="url"
              value={formData.highlightsUrl}
              onChange={(e) => handleChange("highlightsUrl", e.target.value)}
              placeholder="https://youtube.com/..."
              disabled={loading}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Link to tournament highlights on YouTube or other platforms
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Completing...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Complete Tournament
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
