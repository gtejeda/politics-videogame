'use client';

import { cn } from '@/lib/utils';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import type { VoteChoice, Ideology } from '@/lib/game/types';

interface VoteData {
  playerId: string;
  playerName: string;
  choice: VoteChoice;
  weight: number;
}

interface VoteBreakdownProps {
  votes: VoteData[];
  yesVotes: number;
  noVotes: number;
  abstainCount: number;
  passed: boolean;
  localPlayerId?: string | null;
  playerIdeologies?: Map<string, Ideology>;
  showMargin?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * VoteBreakdown - Reusable vote results display
 *
 * Shows vote-by-vote breakdown with player names, choices, and weights.
 * Optionally displays the margin ("Passed 3-2" or "Failed 2-3").
 */
export function VoteBreakdown({
  votes,
  yesVotes,
  noVotes,
  abstainCount,
  passed,
  localPlayerId,
  playerIdeologies,
  showMargin = true,
  compact = false,
  className,
}: VoteBreakdownProps) {
  const getVoteIcon = (choice: VoteChoice) => {
    switch (choice) {
      case 'yes':
        return '✓';
      case 'no':
        return '✗';
      case 'abstain':
        return '—';
    }
  };

  const getVoteColor = (choice: VoteChoice) => {
    switch (choice) {
      case 'yes':
        return 'text-green-600 dark:text-green-400';
      case 'no':
        return 'text-red-600 dark:text-red-400';
      case 'abstain':
        return 'text-gray-500';
    }
  };

  const margin = `${Math.max(yesVotes, noVotes)}-${Math.min(yesVotes, noVotes)}`;
  const marginText = passed ? `Passed ${margin}` : `Failed ${margin}`;

  return (
    <div className={cn('rounded-lg bg-muted p-4', className)}>
      {/* Header with totals */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Vote Results</h3>
        {showMargin && (
          <span
            className={cn(
              'text-sm font-bold',
              passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {marginText}
          </span>
        )}
      </div>

      {/* Vote Totals */}
      <div className={cn('mb-4 flex justify-center', compact ? 'gap-4' : 'gap-8')}>
        <div className="text-center">
          <div className={cn('font-bold text-green-600', compact ? 'text-lg' : 'text-2xl')}>
            {yesVotes}
          </div>
          <div className="text-sm text-muted-foreground">Yes</div>
        </div>
        <div className="text-center">
          <div className={cn('font-bold text-red-600', compact ? 'text-lg' : 'text-2xl')}>
            {noVotes}
          </div>
          <div className="text-sm text-muted-foreground">No</div>
        </div>
        {abstainCount > 0 && (
          <div className="text-center">
            <div className={cn('font-bold text-gray-500', compact ? 'text-lg' : 'text-2xl')}>
              {abstainCount}
            </div>
            <div className="text-sm text-muted-foreground">Abstain</div>
          </div>
        )}
      </div>

      {/* Individual Votes */}
      <div className="flex flex-wrap justify-center gap-2">
        {votes.map((vote) => {
          const ideology = playerIdeologies?.get(vote.playerId);
          return (
            <div
              key={vote.playerId}
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-sm',
                vote.playerId === localPlayerId && 'ring-2 ring-primary'
              )}
              style={{
                backgroundColor: ideology
                  ? `${IDEOLOGY_DEFINITIONS[ideology].color}20`
                  : undefined,
              }}
            >
              {ideology && <span>{IDEOLOGY_DEFINITIONS[ideology].icon}</span>}
              <span>{vote.playerName}</span>
              <span className={cn('font-bold', getVoteColor(vote.choice))}>
                {getVoteIcon(vote.choice)}
                {vote.weight > 1 && <span className="ml-0.5 text-xs">×{vote.weight}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact vote summary for history entries
 */
export function VoteSummary({
  yesVotes,
  noVotes,
  passed,
  className,
}: {
  yesVotes: number;
  noVotes: number;
  passed: boolean;
  className?: string;
}) {
  const margin = `${Math.max(yesVotes, noVotes)}-${Math.min(yesVotes, noVotes)}`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        passed
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        className
      )}
    >
      {passed ? '✓' : '✗'} {margin}
    </span>
  );
}
