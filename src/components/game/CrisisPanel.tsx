'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { CrisisEvent, ActiveCrisis, CrisisSeverity } from '@/lib/game/crises';
import type { PlayerStatePayload } from '@/lib/game/events';

interface CrisisPanelProps {
  crisis: CrisisEvent;
  contributions: Map<string, number>;
  turnsRemaining: number;
  localPlayerId: string | undefined;
  players: PlayerStatePayload[];
  localPlayerInfluence: number;
  onContribute: (amount: number) => void;
}

export function CrisisPanel({
  crisis,
  contributions,
  turnsRemaining,
  localPlayerId,
  players,
  localPlayerInfluence,
  onContribute,
}: CrisisPanelProps) {
  const [contributionAmount, setContributionAmount] = useState(1);
  const [confirmingContribution, setConfirmingContribution] = useState(false);

  // Calculate current progress
  const totalContributed = Array.from(contributions.values()).reduce((sum, v) => sum + v, 0);
  const progressPercent = Math.min(100, (totalContributed / crisis.contributionThreshold) * 100);

  // Check player's current contribution
  const localContribution = localPlayerId ? (contributions.get(localPlayerId) || 0) : 0;
  const canContributeMore = localContribution < crisis.maxContributionPerPlayer;
  const maxAdditionalContribution = Math.min(
    crisis.maxContributionPerPlayer - localContribution,
    localPlayerInfluence
  );

  const handleConfirmContribution = () => {
    onContribute(contributionAmount);
    setConfirmingContribution(false);
    setContributionAmount(1);
  };

  const getSeverityColor = (severity: CrisisSeverity): string => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'moderate': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'severe': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getSeverityIcon = (severity: CrisisSeverity): string => {
    switch (severity) {
      case 'minor': return '⚠️';
      case 'moderate': return '🔶';
      case 'severe': return '🚨';
    }
  };

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  return (
    <>
      {/* Contribution Confirmation Dialog */}
      <AlertDialog open={confirmingContribution} onOpenChange={setConfirmingContribution}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Contribute to Crisis Resolution</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to contribute <strong>{contributionAmount} Influence</strong> to help resolve the {crisis.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 rounded-lg border p-4 text-sm">
            <p className="mb-2"><strong>What this means:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>You will lose {contributionAmount} Influence</li>
              <li>Your contribution helps the nation collectively resolve the crisis</li>
              <li>If successful, everyone benefits; if failed, everyone suffers</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmContribution}>Contribute</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="border-2 border-red-300 dark:border-red-800">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{getSeverityIcon(crisis.severity)}</span>
                {crisis.name}
              </CardTitle>
              <CardDescription className="mt-1">
                <span className={cn('inline-block px-2 py-0.5 rounded text-xs', getSeverityColor(crisis.severity))}>
                  {crisis.severity.toUpperCase()}
                </span>
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  {turnsRemaining} turns remaining
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm">{crisis.description}</p>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progress: {totalContributed}/{crisis.contributionThreshold}</span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  progressPercent >= 100 ? 'bg-green-500' : 'bg-amber-500'
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Contributions List */}
          <div className="text-sm">
            <p className="font-medium mb-1">Contributions:</p>
            {contributions.size === 0 ? (
              <p className="text-muted-foreground text-xs">No contributions yet</p>
            ) : (
              <div className="space-y-1">
                {Array.from(contributions.entries()).map(([playerId, amount]) => (
                  <div key={playerId} className="flex justify-between text-xs bg-muted/50 p-1 rounded">
                    <span>{getPlayerName(playerId)}</span>
                    <span className="font-medium">{amount} Influence</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contribution Controls */}
          {canContributeMore && maxAdditionalContribution > 0 && (
            <div className="border-t pt-3">
              <p className="text-sm mb-2">Contribute your Influence to help resolve the crisis:</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContributionAmount(Math.max(1, contributionAmount - 1))}
                    disabled={contributionAmount <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-bold">{contributionAmount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setContributionAmount(Math.min(maxAdditionalContribution, contributionAmount + 1))}
                    disabled={contributionAmount >= maxAdditionalContribution}
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={() => setConfirmingContribution(true)}
                  disabled={contributionAmount < 1}
                >
                  Contribute
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Max: {crisis.maxContributionPerPlayer} per player (you&apos;ve contributed {localContribution})
              </p>
            </div>
          )}

          {/* Success/Failure Preview */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
              <p className="font-medium text-green-700 dark:text-green-300">If Resolved:</p>
              <p className="text-green-600 dark:text-green-400">
                Stability {crisis.successEffect.stabilityChange >= 0 ? '+' : ''}{crisis.successEffect.stabilityChange},
                Budget {crisis.successEffect.budgetChange >= 0 ? '+' : ''}{crisis.successEffect.budgetChange}
              </p>
            </div>
            <div className="p-2 rounded bg-red-50 dark:bg-red-900/20">
              <p className="font-medium text-red-700 dark:text-red-300">If Failed:</p>
              <p className="text-red-600 dark:text-red-400">
                Stability {crisis.failureEffect.stabilityChange >= 0 ? '+' : ''}{crisis.failureEffect.stabilityChange},
                Budget {crisis.failureEffect.budgetChange >= 0 ? '+' : ''}{crisis.failureEffect.budgetChange}
              </p>
            </div>
          </div>

          {/* Historical Note */}
          {crisis.historicalNote && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <span className="font-medium">📚 Historical Note: </span>
              {crisis.historicalNote}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
