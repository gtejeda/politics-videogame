'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { VoteBreakdown } from './VoteBreakdown';
import type { TurnHistoryEntry as TurnHistoryEntryType, VoteRecord } from '@/lib/game/turn-history';
import type { Ideology } from '@/lib/game/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TurnHistoryEntryProps {
  entry: TurnHistoryEntryType;
}

// Vote icon based on choice
function VoteIcon({ vote }: { vote: 'yes' | 'no' | 'abstain' }) {
  switch (vote) {
    case 'yes':
      return <span title="Yes">👍</span>;
    case 'no':
      return <span title="No">👎</span>;
    case 'abstain':
      return <span title="Abstain">🤷</span>;
  }
}

// Individual vote row
function VoteRow({ record }: { record: VoteRecord }) {
  const ideologyDef = IDEOLOGY_DEFINITIONS[record.playerIdeology];

  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: ideologyDef?.color || '#888' }}
          title={ideologyDef?.name}
        />
        <span>{record.playerName}</span>
        {record.voteWeight > 1 && (
          <Badge variant="outline" className="text-xs">
            +{record.influenceSpent} inf
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <VoteIcon vote={record.vote} />
        <span className="text-muted-foreground">
          {record.voteWeight > 1 ? `×${record.voteWeight}` : ''}
        </span>
      </div>
    </div>
  );
}

/**
 * TurnHistoryEntry - Single turn record for History tab
 *
 * Shows:
 * - Turn number and active player
 * - Proposal details
 * - Vote breakdown
 * - Nation changes
 * - Player movements
 */
export function TurnHistoryEntry({ entry }: TurnHistoryEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const ideologyDef = IDEOLOGY_DEFINITIONS[entry.activePlayerIdeology];

  // Create ideology map and vote data for VoteBreakdown
  const { playerIdeologies, voteData } = useMemo(() => {
    const ideologies = new Map<string, Ideology>();
    const votes = entry.votes.map((v) => {
      ideologies.set(v.playerId, v.playerIdeology);
      return {
        playerId: v.playerId,
        playerName: v.playerName,
        choice: v.vote,
        weight: v.voteWeight,
      };
    });
    return { playerIdeologies: ideologies, voteData: votes };
  }, [entry.votes]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-muted-foreground">Turn {entry.turnNumber}</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: ideologyDef?.color || '#888' }}
              />
              <span>{entry.activePlayerName}</span>
            </div>
          </CardTitle>
          <Badge
            variant={entry.outcome === 'passed' ? 'default' : 'destructive'}
            className={cn(
              entry.outcome === 'passed' && 'bg-green-500 hover:bg-green-600'
            )}
          >
            {entry.outcome === 'passed' ? 'Passed' : 'Failed'} {entry.margin}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Proposal Summary */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="font-medium">{entry.proposal.cardTitle}</p>
          <p className="text-sm text-muted-foreground">
            Option: {entry.proposal.optionChosen}
          </p>
          {entry.outcome === 'passed' && (
            <div className="mt-2 flex gap-4 text-sm">
              {entry.proposal.nationImpact.budgetEffect !== 0 && (
                <span
                  className={cn(
                    entry.proposal.nationImpact.budgetEffect > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  Budget: {entry.proposal.nationImpact.budgetEffect > 0 ? '+' : ''}
                  {entry.proposal.nationImpact.budgetEffect}
                </span>
              )}
              {entry.proposal.nationImpact.stabilityEffect !== 0 && (
                <span
                  className={cn(
                    entry.proposal.nationImpact.stabilityEffect > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  Stability: {entry.proposal.nationImpact.stabilityEffect > 0 ? '+' : ''}
                  {entry.proposal.nationImpact.stabilityEffect}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Vote Summary - Always visible */}
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="text-green-600">👍 {entry.yesCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-600">👎 {entry.noCount}</span>
          </span>
          {entry.abstainCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">🤷 {entry.abstainCount}</span>
            </span>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              Show Details
            </>
          )}
        </Button>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {/* Vote Breakdown - T013a: Use VoteBreakdown component */}
                <VoteBreakdown
                  votes={voteData}
                  yesVotes={entry.yesCount}
                  noVotes={entry.noCount}
                  abstainCount={entry.abstainCount}
                  passed={entry.outcome === 'passed'}
                  playerIdeologies={playerIdeologies}
                  showMargin={false}
                  compact={true}
                />

                {/* Nation Changes */}
                {(entry.nationChanges.budgetDelta !== 0 ||
                  entry.nationChanges.stabilityDelta !== 0) && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Nation Changes</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-muted-foreground">Budget</p>
                        <p>
                          {entry.nationChanges.budgetBefore} →{' '}
                          <span
                            className={cn(
                              entry.nationChanges.budgetDelta > 0
                                ? 'text-green-600'
                                : entry.nationChanges.budgetDelta < 0
                                  ? 'text-red-600'
                                  : ''
                            )}
                          >
                            {entry.nationChanges.budgetAfter}
                          </span>
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-muted-foreground">Stability</p>
                        <p>
                          {entry.nationChanges.stabilityBefore} →{' '}
                          <span
                            className={cn(
                              entry.nationChanges.stabilityDelta > 0
                                ? 'text-green-600'
                                : entry.nationChanges.stabilityDelta < 0
                                  ? 'text-red-600'
                                  : ''
                            )}
                          >
                            {entry.nationChanges.stabilityAfter}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Player Movements */}
                {entry.playerMovements.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Player Movements</p>
                    <div className="space-y-1">
                      {entry.playerMovements
                        .filter((m) => m.totalMovement !== 0)
                        .map((movement) => (
                          <div
                            key={movement.playerId}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{movement.playerName}</span>
                            <span
                              className={cn(
                                movement.totalMovement > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              )}
                            >
                              {movement.positionBefore} → {movement.positionAfter} (
                              {movement.totalMovement > 0 ? '+' : ''}
                              {movement.totalMovement})
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
